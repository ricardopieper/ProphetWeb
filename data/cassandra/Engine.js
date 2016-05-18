var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");

var Engine = function (engineData) {

    meta.copy(engineData, this);
   
    this.save = function (callback) {

        if (!engineData.engine_id) {
            var query = 'insert into engines (engine_id, description, location, name) values(uuid(), ?, ?, ?)';
            client.execute(query, [
                engineData.description,
                engineData.location,
                engineData.name,
            ], { prepare: true }, function (err, data) {
                callback(err);
            });
        } else {
            var query = 'update engines set description = ?, location = ?, name = ?, where engine_id = ?';
            client.execute(query, [
                engineData.description,
                engineData.location,
                engineData.name,
                engineData.engine_id
            ], { prepare: true }, function (err, data) {
                callback(err);
            });
        }
    }

    this.delete = function (callback) {
        console.log(engineData);
        var query = 'delete from engines where engine_id = ?';
        client.execute(query, [
            engineData.engine_id
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }

};
Engine.find = function (callback) {
    var query = 'select * from engines';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, data.rows.map(x=> new Engine(x)));
    });
};
Engine.findById = function (engine_id) {
    return {
        exec: function (callback) {
            var query = 'select * from engines where engine_id = ?';
            client.execute(query, [engine_id], { prepare: true }, function (err, data) {
                console.log(data);
                callback(err, data && data.rows && data.rows.length != 0 ? new Engine(data.rows[0]) : null);
            });
        }
    }
};

module.exports = Engine;