var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");

var View = function (viewData) {

    meta.copy(viewData, this);

    this.save = function (callback) {

        var query = 'insert into dataviews (view_id, name, predictions) values (uuid(), ?,?)';
        client.execute(query, [
            this.name,
            this.predictions
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }

    this.addPrediction = function (prediction, callback) {
        console.log(prediction);
        var query = 'update dataviews set predictions = predictions + ? where view_id = ?';
        client.execute(query, [
            [prediction],
            this.view_id
        ], { prepare: true }, function (err, data) {
            callback(err, data);
        });

    }

    this.changeName = function (name, callback) {
        var query = 'update dataviews set name =  ? where view_id = ?';
        client.execute(query, [
            name,
            this.view_id
        ], { prepare: true }, function (err, data) {
            callback(err, data);
        });

    }

    this.removePrediction = function (prediction, callback) {

        var query = 'update dataviews set predictions = predictions - ? where view_id = ?';
        client.execute(query, [
            [prediction],
            this.view_id
        ], { prepare: true }, function (err, data) {
            callback(err, data);
        });
    }



    this.delete = function (callback) {
        var query = 'delete from dataviews where view_id = ?';
        client.execute(query, [
            this.view_id,
        ], { prepare: true }, function (err, data) {
            callback(err, data);
        });
    }

};
View.find = function (callback) {
    var query = 'select * from dataviews';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, !data || !data.rows ? [] : data.rows.map(x => new View(x)));
    });
};

View.findById = function (view_id) {
    return {
        exec: function (callback) {
            var query = 'select * from dataviews where view_id = ?';
            client.execute(query, [view_id], { prepare: true }, function (err, data) {
                callback(err, data && data.rows && data.rows.length != 0 ? new View(data.rows[0]) : null);
            });
        }
    }
};

View.findById = function (view_id) {
    return {
        exec: function (callback) {
            var query = 'select * from dataviews where view_id = ?';
            client.execute(query, [view_id], { prepare: true }, function (err, data) {
                callback(err, data && data.rows && data.rows.length != 0 ? new View(data.rows[0]) : null);
            });
        }
    }
};

module.exports = View;