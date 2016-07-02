var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbtype = "cassandra";

if (dbtype == "cassandra") {

    var cassandra = require('cassandra-driver');
    var config = require("./data/Connection");

    var client = new cassandra.Client({
        contactPoints: config.contactPoints,
    });

    var query = "select table_name from system_schema.tables where keyspace_name = 'prophet';";
    
    client.execute(query, [], { prepare: false }, function(err, data) {
       console.log(data);
 
      if (err){
	console.log("error: ",err);
        return;
      }

      var tables = data.rows.map(x => x.table_name);
       
       if (!tables || !tables.length)
       {
          
           console.log("Criando keyspace...");    
           
           var fs = require('fs');

           fs.readFile('./data/cassandra/schema.sql', 'utf8', function(err, data){
                
               var sqls = data
                    .replace("\n", "")
                    .replace("\r", "")
                    .replace("\t", "")
                    .split(";")
                    .filter(x=> x != "")
                    .map(x => {
                         return { 
                             query: x.trim(), 
                             params: [] 
                         }; 
                    })
                    .map(x=>x.query);
               
               console.log(sqls);
               
               function executeAll(arr){
                   
                   var nexts = arr.splice(1);
                   
                   var current = arr[0];
                   console.log("Executando "+current);
                   client.execute(current, [], { prepare: true }, function(err1){
                        if (err1) {
                            console.log("Erro: "+err1);
                        } else {
                            console.log("Sucesso");
                            if (nexts && nexts.length){
                                executeAll(nexts);
                            }
                        }      
                    });
                   
               }
               
              executeAll(sqls);
               
           });
        
       }
       
    });


}

var routes = require('./routes/index');
var digesters = require('./routes/digesters');
var engines = require('./routes/engines');
var models = require('./routes/models');
var uploads = require('./routes/uploads');
var predictions = require('./routes/predictions');
var views = require('./routes/views');


var app = express();

var engine = require('ejs-locals')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', engine);
//app.set('view engine', 'jade');
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/digesters', digesters);
app.use('/engines', engines);
app.use('/models', models);
app.use('/uploads', uploads);
app.use('/predictions', predictions);
app.use('/views', views);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

    app.locals.pretty = true;
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
