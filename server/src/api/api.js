var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID;

var db = mongojs("moneytimer", ["goals"]);

// ============================== Load all goals ==============================
router.get("/api/getallgoals", function(req, res) {
  db.goals.find((err, data) => {
      res.json(data);
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


// ============================== Save changes to goal object in DB ==============================
router.put("/api/savegoalchanges", function(req, res) {
  console.log("PUT REQUEST FROM CLIENT");
  var _id = req.body._id;
  var objToSave = Object.assign({}, req.body);
  if (objToSave.goalImageFile === undefined) delete objToSave.goalImageFile;
  console.log("objToSave : ", objToSave);
 
  db.goals.update({_id : ObjectId(_id) },
    { 
      $set : { 
        goalTitle : req.body.goalTitle,
        goalDescription : req.body.goalDescription,
        goalPrice: req.body.goalPrice,
        goalImageFile : req.body.goalImageFile,
        percentToSave : req.body.percentToSave,
        percentComplete : req.body.percentComplete
      }
    });
  
  res.send("OK!");
});

router.get("/", function(req, res) {
    res.send("Server status is: OK");
});

module.exports = router;