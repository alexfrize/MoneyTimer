var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID;

var db = mongojs("moneytimer", ["goals"]);
var dbFinished = mongojs("moneytimer", ["finished"]);
var dbSettings = mongojs("moneytimer", ["settings"]);

// ============================== Load all goals ==============================
router.get("/api/getallgoals", function(req, res) {
  db.goals.find((err, data) => {
      res.json(data);
    }
  );
});

// ============================== Load finished goals ==============================
router.get("/api/getfinishedgoals", function(req, res) {
  dbFinished.finished.find((err, data) => {
      res.json(data);
    }
  );
});

// ============================== Load settings ==============================
router.get("/api/loadsettings", function(req, res) {
  dbSettings.settings.findOne((err, data) => {
      res.json(data);
      console.log("load settings: ", data);
    }
  );
});

// ============================== Save settings DB ==============================
router.put("/api/savesettings", function(req, res) {
  console.log("SAVE SETTINGS");
  var _id;
  console.log(req.body.totalEarnings);
  console.log(req.body.hourlySalary);
  console.log(req.body.day);
  console.log(req.body.timeWorkedOutToday_milliseconds);
  dbSettings.settings.findOne((err, data) => {
      _id = data._id;
      console.log("_id===", _id);
      dbSettings.settings.update({ _id },
        { 
          $set : { 
              totalEarnings : req.body.totalEarnings,
              hourlySalary : req.body.hourlySalary,
              day : req.body.day,
              timeWorkedOutToday_milliseconds : req.body.timeWorkedOutToday_milliseconds
          }
        });
      res.send("SETTINGS WERE SAVED");
    }
  );
});

// ============================== Save salary to DB ==============================
router.put("/api/savesalary", function(req, res) {
  console.log("SAVE SALARY");
  var _id;
  console.log(req.body.hourlySalary);
  dbSettings.settings.findOne((err, data) => {
      _id = data._id;
      console.log("_id===", _id);
      dbSettings.settings.update({ _id },
        { 
          $set : { 
              hourlySalary : req.body.hourlySalary,
          }
        });
      res.send("New salary was saved!");
    }
  );
});
// ============================== Save goal object ==============================
router.post("/api/savenewgoal", function(req, res) {
  console.log("req.body === ", req.body);
  var _id = ObjectId();
  console.log("_id : ", _id);
  var objToSave = Object.assign({ _id }, req.body);
  console.log("objToSave : ", objToSave);
  
  db.goals.insert(objToSave);
  res.send(_id);
});

// ============================== Save finished goal object ==============================
router.post("/api/savefinishedgoal", function(req, res) {
  console.log("req.body === ", req.body);
  // var _id = ObjectId();
  // console.log("_id : ", _id);
  var objToSave = Object.assign({ }, req.body);
  console.log("objToSave : ", objToSave);
  
  dbFinished.finished.insert(objToSave);
  var cnt = dbFinished.finished.count({});
  console.log("cnt==",cnt);
  res.json({"OK" : "Finished goal saved"});
});

// ============================== Save changes to goal object in DB ==============================
router.put("/api/savegoalchanges", function(req, res) {
  console.log("PUT REQUEST FROM CLIENT");
  var _id = req.body._id;
  console.log("req.body.priority ==", req.body.priority);
  console.log("req.body ==", req.body);
  db.goals.update({_id : ObjectId(_id) },
    { 
      $set : { 
        goalTitle : req.body.goalTitle,
        goalDescription : req.body.goalDescription,
        goalPrice: req.body.goalPrice,
        goalImageFile : req.body.goalImageFile,
        percentToSave : req.body.percentToSave,
        dollarsComplete : req.body.dollarsComplete,
        percentComplete : req.body.percentComplete,
        priority : req.body.priority
      }
    });
  
  res.send("OK!");
});

// ============================== Save all goals to database ==============================
router.put("/api/updateallgoalsindexes", function(req, res) {
  console.log("UPDATES ALL GOALS INDEXES IN DB");
  var updatesObjArray = req.body;
  for (let updateObj of updatesObjArray) {
    db.goals.update({_id : ObjectId(updateObj._id) },
      { 
        $set : { 
          priority : updateObj.priority,
          dollarsComplete : updateObj.dollarsComplete
        }
      });
  }

  res.send("OK!");
});

// ============================== Deletes goal from database ==============================
router.delete("/api/deletegoal", function(req, res) {
  console.log("DELETE:");
  var _id = req.query.id;
  console.log(_id);
 
  db.goals.remove({ _id :  ObjectId(_id) }, true );
 
  res.send("deleted");
});

// ============================== Deletes finished goal from archive database ==============================
router.delete("/api/deletefinishedgoal", function(req, res) {
  console.log("DELETE FROM ARCHIVE:");
  var _id = req.query.id;
  console.log("Del object ID:", _id);
  dbFinished.finished.remove({ _id :  _id }, { justOne: true });

  res.send("deleted");
});



router.get("/", function(req, res) {
    res.send("Server status is: OK");
});

module.exports = router;
