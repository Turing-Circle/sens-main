var express = require('express');
var app = express();
var fs = require("fs");
var pg = require('pg');

//Require the database queries file
var db = require('../queries');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

//Test API call
app.get('/listUsers', function(req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
});

//Database Service Calls
app.get('/db', dn.getAllData);




//Listening to port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


