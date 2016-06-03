var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");

var Upload = function (uploadData) {

    meta.copy(uploadData, this);
   
    this.save = function (callback) {
               
        var query = 'insert into uploads (model_id, upload_id, file, date, processed, result) values (?, uuid(), ?, toTimestamp(now()), ?, ?)';
        client.execute(query, [
            this.model_id,
            this.file,
            false,
            "Pending",
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
        
    }

    this.delete = function (callback) {
        var query = 'delete from uploads where upload_id = ? and model_id = ?';
        client.execute(query, [
            this.upload_id,
            this.model_id
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
    }

};
Upload.find = function (callback) {
    var query = 'select model_id, upload_id, date, processed, result from uploads';
    client.execute(query, [], { prepare: true }, function (err, data) {
        callback(err, !data || !data.rows? []: data.rows.map(x=> new Upload(x)));
    });
};

Upload.findById = function (upload_id, model_id) {
    return {
        exec: function (callback) {
            var query = 'select * from uploads where upload_id = ? and model_id = ?';
            client.execute(query, [upload_id, model_id], { prepare: true }, function (err, data) {
                callback(err, data && data.rows && data.rows.length != 0 ? new Upload(data.rows[0]) : null);
            });
        }
    }
};

module.exports = Upload;