var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");

var Prediction = function (modelData) {

    meta.copy(modelData, this);

    this.save = function (callback) {
        console.log("Prediction.save", modelData);
        var query = 'INSERT INTO modelpredictions'
            + '(model_id, prediction_id, amountpredictions, fromvalue, tovalue, inputvar, inputvalues, '
            + 'state) VALUES(?, uuid(), ?, ?, ?, ?, ?, 0);';
        client.execute(query, [
            this.model_id,
            this.amountpredictions,
            this.fromvalue,
            this.tovalue,
            this.inputvar,
            this.inputvalues
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }
};

Prediction.find = function (callback) {
    var query = 'select * from modelpredictions;';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, !data || !data.rows ? [] : data.rows.map(x => new Prediction(x)));
    });
};

Prediction.findById = function (model_id, prediction_id) {
    return {
        exec: function (callback) {
            var query = 'select * from modelpredictions where model_id = ? and prediction_id = ?';
            client.execute(query, [model_id, prediction_id], { prepare: true }, function (err, data) {
                callback(err, (data || {}).rows);
            });
        }
    }
};

module.exports = Prediction;