var express = require('express');
var router = express.Router();
var Upload = require('../data/cassandra/Upload');


var returnJson = (req, res, next) => (err, data) => {
    if (err) return next(err);
    res.json(data);
}

router.get('/', function (req, res, next) {
    Upload.find(returnJson(req, res, next));
});

module.exports = router;
