var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");

var Digester = function (digesterData) {

    meta.copy(digesterData, this);
   
    this.save = function (callback) {

        if (!digesterData.digester_id) {
            var query = 'insert into digesters (digester_id, description, location, name, owner) values(uuid(), ?, ?, ?, ?)';
            client.execute(query, [
                digesterData.description,
                digesterData.location,
                digesterData.name,
                digesterData.owner
            ], { prepare: true }, function (err, data) {
                callback(err);
            });
        } else {
            var query = 'update digesters set description = ?, location = ?, name = ?, owner = ? where digester_id = ?';
            client.execute(query, [
                digesterData.description,
                digesterData.location,
                digesterData.name,
                digesterData.owner,
                digesterData.digester_id
            ], { prepare: true }, function (err, data) {
                callback(err);
            });
        }
    }

    this.delete = function (callback) {
        console.log(digesterData);
        var query = 'delete from digesters where digester_id = ?';
        client.execute(query, [
            digesterData.digester_id
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }

};
Digester.find = function (callback) {
    var query = 'select * from digesters';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, data.rows.map(x=> new Digester(x)));
    });
};
Digester.findById = function (digester_id) {
    return {
        exec: function (callback) {
            var query = 'select * from digesters where digester_id = ?';
            client.execute(query, [digester_id], { prepare: true }, function (err, data) {
                console.log(data);
                callback(err, data && data.rows && data.rows.length != 0 ? new Digester(data.rows[0]) : null);
            });
        }
    }
};

module.exports = Digester;