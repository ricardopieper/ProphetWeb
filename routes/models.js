var express = require('express');
var router = express.Router();
var Model = require('../data/cassandra/Model');
var Upload = require('../data/cassandra/Upload');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage });

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
    var model = new Model(req.body);
    model.save(returnJson(req, res, next));
});

router.delete('/:model', (req, res, next) => {
    new Model(req.model).delete(returnJson(req, res, next));
});

router.get('/:model', (req, res, next) => {
    res.json(req.model);
});

router.get('/', function (req, res, next) {
    Model.find(returnJson(req, res, next));
});


router.get('/', function (req, res, next) {
    Model.find(returnJson(req, res, next));
});

router.post('/train', function(req,res,next){
   var model = new Model({ model_id: req.body.model_id });
   model.scheduleTraining(returnJson(req, res, next));
});

router.post('/upload', upload.single('file'), function (req, res, next) {
         
    var fs = require('fs');
    console.log(req.file);
    fs.readFile(req.file.path, 'utf8', function(errFile, data){
        if (!errFile && data){
            var upload = new Upload({
                model_id: req.body.model_id,
                file: data
            })

            console.log(data.length);

            upload.chunkSave((err)=>{
                
                if (err) {
                    res.json({ok: false, error: err});
                }
                else {
                    res.json({
                        ok: true
                    });
                }

                fs.unlinkSync(req.file.path);	
            });
        }
        else{
            res.json({ok: false, error: errFile});
        }
    });

});

module.exports = router;
