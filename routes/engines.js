var express = require('express');
var router = express.Router();
var Engine = require('../data/cassandra/Engine');

var returnJson = (req, res, next) => (err, data) => {
    if (err) return next(err);
    res.json(data);
}

router.param('engine', (req, res, next, id) => {

    var query = Engine.findById(id);

    query.exec((err, engine) => {
        if (err) return next(err);

        if (!engine) return next(new Error('can\'t find engine'));

        req.engine = engine;

        return next();
    });
});

router.post('/', (req, res, next) => {
    var engine = new Engine(req.body);
    engine.save(returnJson(req, res, next));
});

router.delete('/:engine', (req, res, next) => {
    new Engine(req.engine).delete(returnJson(req, res, next));
});


router.get('/:engine', (req, res, next) => {
    res.json(req.engine);
});

router.get('/', function (req, res, next) {
    Engine.find(returnJson(req, res, next));
});

router.get('/:engine/models', (req, res, next) => {
    var id = req.engine.engine_id;
    var query = Model.findEngineModels(id);
    query.exec(returnJson(req, res, next));
});

module.exports = router;
