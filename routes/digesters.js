var express = require('express');
var router = express.Router();
var Digester = require('../data/cassandra/Digester');
var Model = require('../data/cassandra/Model');

var returnJson = (req, res, next) => (err, data) => {
    if (err) return next(err);
    res.json(data);
}

router.param('digester', (req, res, next, id) => {

    var query = Digester.findById(id);

    query.exec((err, digester) => {
        if (err) return next(err);

        if (!digester) return next(new Error('can\'t find digester'));

        req.digester = digester;

        return next();
    });
});

router.post('/', (req, res, next) => {
    var digester = new Digester(req.body);
    digester.save(returnJson(req, res, next));
});

router.delete('/:digester', (req, res, next) => {
    new Digester(req.digester).delete(returnJson(req, res, next));
});

router.get('/:digester', (req, res, next) => {
    res.json(req.digester);
});
router.get('/', function (req, res, next) {
    Digester.find(returnJson(req, res, next));
});

router.get('/:digester/models', (req, res, next) => {
    var id = req.digester.digester_id;
    var query = Model.findDigesterModels(id);
    query.exec(returnJson(req, res, next));
});

module.exports = router;
