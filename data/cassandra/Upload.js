var cassandra = require('cassandra-driver');
var client = new cassandra.Client(require("../Connection"));
var meta = require("../../Helpers/meta");
var Model = require("./Model");

var Upload = function (uploadData) {

    meta.copy(uploadData, this);
    var self = this;
    this.save = function (callback) {
            
      
        console.log("saving upload");   

        var query = 'insert into uploads (model_id, upload_id, date, processed, result) values (?, ?, toTimestamp(now()), ?, ?)';
        client.execute(query, [
            this.model_id,
            this.upload_id,
            false,
            "Pending",
        ], { prepare: true }, function (err, data) {
            console.log("upload result", err, data);   

            callback(err);
        });
        
    }


    this.chunkSave = function(callback) {
        var self = this;
        self.upload_id = cassandra.types.Uuid.random();
            

        var batchSize = 5 * 1000 * 1000; //5mb max
        var remainingChars = this.file.length;

        var chunkified = [];

        while (remainingChars > 0){
             console.log("chunkifying, remaining", remainingChars);   
            var charsToInsert = Math.min(batchSize, remainingChars);

            chunkified.push(this.file.substr(this.file.length - remainingChars, charsToInsert));

            console.log(chunkified.map(x=> x.length));
            remainingChars -= charsToInsert;
        }
        
        console.log("chunks: ", chunkified.length);   


        function uploadChunks(head, tail, model_id, upload_id, startingtime){

            console.log("saving chunk for model ", model_id, " upload ", upload_id, "size chunk ", head.length, "remaining", tail.length)
         
            var query = 'insert into uploadchunks (model_id, upload_id, date, chunk) values (?, ?, toTimestamp(now()), ?)';
            client.execute(query, [
                model_id,
                upload_id,
                head,
            ], { prepare: true }, function (err, data) {
                if (err){
                    callback(err);
                }else{
                    
                    if (tail && tail.length > 0) {
                        uploadChunks(tail[0], tail.slice(1), model_id, upload_id, startingtime)
                    } else {
                        var end = new Date().getTime();
                        var time = end - startingtime;

                          self.save((err, data) =>{
                            if (err){
                            
                                console.log("err upload",err, data);   
                                callback(err, data);
                            
                            } else {
   
                                Model.setUploadTime(model_id, time).exec(function(){ 
                                    callback(null);
                                });

                            }
                        });
                    }
                }
            });

        }
        var start = new Date().getTime();

        uploadChunks(chunkified[0], chunkified.slice(1), this.model_id, this.upload_id, start);

      

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