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
router.post("/api/savegoal", function(req, res) {
  console.log("req.body === ", req.body);
  var _id = ObjectId();
  console.log("_id : ", _id);
  var objToSave = Object.assign({ _id }, req.body);
  console.log("objToSave : ", objToSave);
  
  db.goals.insert(objToSave);
  res.send(_id);
});

router.get("/", function(req, res) {
    res.send("Server status is: OK");
});

module.exports = router;
