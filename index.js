var express = require('express');
var app = express();
var pg = require('pg');
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table ', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});


app.get('/userdata',function(request,response){
	
	var query1 = url.parse(request.url, true);
	var name = query1.query.uname;
	var pass = query1.query.pwd;
	
	response.send(name + pass);
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	
  	  client.query('SELECT * FROM userdata WHERE name = \'' + name +'\' and password = \''+pass +'\'', function(err, result) {
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


