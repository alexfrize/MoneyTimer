var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID;

var db = mongojs("moneytimer", ["goals"]);

router.get("/api/getallgoals", function(req, res) {
  db.goals.find((err, data) => {
      res.json(data);
    }
  );
});

router.get("/", function(req, res) {
    res.send("Server status is: OK");
});

module.exports = router;
