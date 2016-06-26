var express = require('express');
var router = express.Router();
var Prediction = require('../data/cassandra/Prediction');
var Model = require('../data/cassandra/Model');

var returnJson = (req, res, next) => (err, data) => {
    if (err) return next(err);
    res.json(data);
}
router.param('model', (req, res, next, id) => {

    var query = Model.findById(id);

    query.exec((err, model) => {
        if (err) return next(err);

        if (!model) return next(new Error('can\'t find model'));

        req.model = model;

        return next();
    });
});

router.post('/', (req, res, next) => {
    var prediction = new Prediction(req.body);
    prediction.save(returnJson(req, res, next));
});

router.get('/', function (req, res, next) {
    Prediction.find(returnJson(req, res, next));
});

router.get('/:model/summary', function (req, res, next) {
    req.model.getSummary(returnJson(req, res, next));
});


router.get('/:model/:prediction', (req, res, next) => {
    var query = Prediction.findById(req.params.model, req.params.prediction);
    query.exec(returnJson(req, res, next));
});

module.exports = router;
