var express = require('express');
var router = express.Router();
var Digesters = require('../data/cassandra/Digester');
var Engines = require('../data/cassandra/Engine');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Prophet' });
});




module.exports = router;