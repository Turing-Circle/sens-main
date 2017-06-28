var express = require('express');
var app = express();
var pg = require('pg');

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


  app.get('/userdata', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	
  	var uname1 = request.body.uname;
  	var pwd1 = request.body.pwd;
    
    client.query('SELECT product_id FROM userdata WHERE name = uname1 ', function(err, result)  done();
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


