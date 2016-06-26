var express = require('express');
var router = express.Router();
var View = require('../data/cassandra/View');

var returnJson = (req, res, next) => (err, data) => {
    if (err) return next(err);
    res.json(data);
}
router.param('view', (req, res, next, id) => {

    var query = View.findById(id);

    query.exec((err, view) => {
        if (err) return next(err);

        if (!view) return next(new Error('can\'t find view'));

        req.view = view;

        return next();
    });
});

router.post('/', (req, res, next) => {

    if (req.body.view_id) {
        var view = new View({
            view_id: req.body.view_id
        });

        view.addPrediction(req.body.prediction, returnJson(req, res, next));

    } else {
        var view = new View({
            name: req.body.name,
            predictions: [req.body.prediction]
        });
        view.save(returnJson(req, res, next));
    }
      
});

router.post('/:view/deletepred', (req, res, next) => {
    req.view.removePrediction(req.body, returnJson(req, res, next));
});

router.post('/:view/changename', (req, res, next) => {
    req.view.changeName(req.body.name, returnJson(req, res, next));
});


router.get('/', (req, res, next) => {
    View.find(returnJson(req, res, next));
});

router.get('/:view', (req, res, next) => {
    res.json(req.view);
});


module.exports = router;
