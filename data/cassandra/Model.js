var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");

var Model = function (modelData) {

    meta.copy(modelData, this);
   
    this.scheduleTraining = function(callback){
        var query = 'update models set state = 1 where model_id = ?';
        client.execute(query, [
            this.model_id                
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }
   
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

};
Model.find = function (callback) {
    var query = 'select * from models';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, !data || !data.rows? []: data.rows.map(x=> new Model(x)));
    });
};

Model.findDigesterModels = function (digester_id) {
    return {
        exec: function (callback) {
            var query = 'select * from digesters where digester_id = ?';
            client.execute(query, [digester_id], { prepare: true }, function (err, data) {
                callback(err, !data || !data.rows? []: data.rows.map(x=> new Model(x)));
            });
        }
    }
};

Model.findEngineModels = function (engine_id) {
    return {
        exec: function (callback) {
            var query = 'select * from models where engine_id = ?';
            client.execute(query, [engine_id], { prepare: true }, function (err, data) {
                callback(err, !data || !data.rows? []: data.rows.map(x=> new Model(x)));
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

module.exports = Model;