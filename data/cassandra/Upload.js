var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");
var Model = require("Model");

var Upload = function (uploadData) {

    meta.copy(uploadData, this);
   
    this.save = function (callback) {
            
        this.upload_id = cassandra.types.Uuid.random();
               
        var query = 'insert into uploads (model_id, upload_id, date, processed, result) values (?, ?, toTimestamp(now()), ?, ?)';
        client.execute(query, [
            this.model_id,
            this.id,
            false,
            "Pending",
        ], { prepare: true }, function (err, data) {
            callback(err);
        });
        
    }


    this.chunkSave = function(callback) {

        this.save((err, data) =>{
            if (err){
                callback(err);
            } else {

                var batchSize = 5 * 1000 * 1000; //5mb max
                var remainingChars = this.file.length;

                var chunkified = [];

                while (remainingChars > 0){

                    var charsToInsert = Math.min(batchSize, remainingChars);

                    chunkified.push(this.file.substr(this.file.length - remainingChars), batchSize);

                    remainingChars -= charsToInsert;
                }



                function uploadChunks(head, tail, model_id, startingtime){


                    var query = 'insert into uploadchunks (model_id, upload_id, chunk_id, chunk) values (?, ?, uuid(), ?)';
                    client.execute(query, [
                        this.model_id,
                        this.upload_id,
                        head,
                    ], { prepare: true }, function (err, data) {
                        if (err){
                            callback(err);
                        }else{
                            
                            if (tail && tail.length > 0) {
                                uploadChunks(tail[0], tail.slice(1), model_id, startingtime)
                            } else {
                                var end = new Date().getTime();
                                var time = end - startingtime;
                                
                                callback(null);
                                Model.setUploadTime(model_id, time).exec(function(){ });
                            }
                        }
                    });

                }
                var start = new Date().getTime();

                uploadChunks(chunkified[0], chunkified.slice(1), this.model_id, start);

            }
        })
       


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