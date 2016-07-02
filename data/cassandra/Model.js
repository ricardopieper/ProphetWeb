var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");
var async = require('async');
var Promise = require("promise")
var Model = function (modelData) {

    meta.copy(modelData, this);

    this.scheduleTraining = function (callback) {
        var query = 'update models set state = 1 where model_id = ?';
        client.execute(query, [
            this.model_id
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }
    var self = this;
    this.save = function (callback) {
        console.log("Model.save", modelData);
        if (!this.model_id) {
            var query = 'insert into models (model_id, digester_id, engine_id, name, inputvars, outputvar, state) values(uuid(), ?, ?, ?, ?, ?, ?)';
            client.execute(query, [
                this.digester_id,
                this.engine_id,
                this.name,
                this.inputvars,
                this.outputvar,
                this.state || 0,
            ], { prepare: true }, function (err, data) {
                callback(err);
            });
        } else {
            var query = 'update models set digester_id = ?, engine_id = ?, name = ?, inputvars = ?, outputvar = ? where model_id = ?';
            client.execute(query, [
                this.digester_id,
                this.engine_id,
                this.name,
                this.inputvars,
                this.outputvar,
                this.model_id
            ], { prepare: true }, function (err, data) {
                callback(err);
            });
        }
    }

    this.delete = function (callback) {
        var query = 'delete from models where model_id = ?';
        client.execute(query, [
            this.model_id
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }

    this.basicModelViewPromise = function () {
        console.log("basicModelViewPromise");
        var query = 'select * from basicmodelview where model_id = ?';
        return new Promise(function (complete, reject) {
            client.execute(query, [self.model_id], { prepare: true }, function (err, data) {
                var result = data && data.rows && data.rows.length != 0 ? data.rows[0] : null;
                if (err) {
                    console.log("basicModelViewPromise ERR", err);

                    reject(err);
                } else {
                    complete(result);
                }
            });
        });
    }
    this.predictionsPromise = function (summary) {
        
        var query = 'select * from modelpredictions where model_id = ? and state = 1 ALLOW FILTERING';
        return new Promise(function (complete, reject) {
            client.execute(query, [self.model_id], { prepare: true }, function (err, data) {
                var result = data && data.rows && data.rows.length != 0 ? data.rows : null;
                if (err) {
                    console.log("predictionsPromise ERR", err);

                    reject(err);
                } else {
                    summary.predictions = result;
                    complete(summary);
                }
            });
        });
    }
    this.lastRecordPromise = function (summary) {
        var fields = self.inputvars.concat(self.outputvar).join(", ");



        var query = 'select ' + fields + ' from prophet.modeldatasets where model_id = ? '
            + 'order by row_id desc limit 1';

        return new Promise(function (complete, reject) {
            client.execute(query, [self.model_id], { prepare: true }, function (err, data) {
                var result = data && data.rows && data.rows.length != 0 ? data.rows[0] : null;
                if (err) {
                    reject(err);
                } else {
                    summary.lastrecord = result;
                    complete(summary);
                }
            });
        });
    }

    this.getSummary = function (callback) {
        console.log("getSummary");
        this.basicModelViewPromise()
            .then(this.predictionsPromise)
            .then(this.lastRecordPromise)
            .then(function (result) {

                callback(null, result);
            })
            .catch(function (err) {
                callback(err, null);
            });
    }

};
Model.find = function (callback) {
    var query = 'select * from models';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, !data || !data.rows ? [] : data.rows.map(x => new Model(x)));
    });
};

Model.findDigesterModels = function (digester_id) {
    return {
        exec: function (callback) {
            var query = 'select * from digesters where digester_id = ?';
            client.execute(query, [digester_id], { prepare: true }, function (err, data) {
                callback(err, !data || !data.rows ? [] : data.rows.map(x => new Model(x)));
            });
        }
    }
};

Model.findEngineModels = function (engine_id) {
    return {
        exec: function (callback) {
            var query = 'select * from models where engine_id = ?';
            client.execute(query, [engine_id], { prepare: true }, function (err, data) {
                callback(err, !data || !data.rows ? [] : data.rows.map(x => new Model(x)));
            });
        }
    }
};


Model.findById = function (model_id) {
    return {
        exec: function (callback) {
            var query = 'select * from models where model_id = ?';
            client.execute(query, [model_id], { prepare: true }, function (err, data) {
                callback(err, data && data.rows && data.rows.length != 0 ? new Model(data.rows[0]) : null);
            });
        }
    }
};


Model.setUploadTime = function (model_id, time) {
    return {
        exec: function (callback) {
            var query = 'update models set millisecondstransferfile = ? where model_id = ?';
            console.log("update models milliseconds id ", model_id, time);
            client.execute(query, [time, model_id], { prepare: true }, function (err, data) {
                if (err){
                    console.log(err, data);
                }
                callback(err, data);
            });
        }
    }
};
module.exports = Model;