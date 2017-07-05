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
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});


app.get('/getAllUser', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM userdata', function(err, result) {
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
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	
  	  client.query('SELECT product_id FROM userdata WHERE email = \'' + name +'\'  and password = \''+pass +'\' ', function(err, result) {
  	  	done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});



app.get('/sensordata', function (request, response) {
  var query1 = url.parse(request.url, true);
	var name = query1.query.pid;

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(' SELECT * FROM test_table WHERE product_id = \''+name +'\' ', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});



app.get('/signup',function(request,response){
	
	var query1 = url.parse(request.url, true);
	var name = query1.query.name;
	var email = (query1.query.uname).trim();
	var phone = query1.query.phone;
	var location = query1.query.loc;
	var pass = query1.query.pwd;
	var prodid = query1.query.pid;
	
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	
  	  client.query(' Insert into userdata (name, email, phone, location, password, product_id) values (   \'' + name +'\' , \''+ email + ' \' , \' '+phone+'\' , \''+ location+'\' , \''+pass+'\' , \''+prodid+ '\'   ) ', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});

// Inserting Sensor Data via GET
app.get('/insertData', function (request, response) {
var query1 = url.parse(request.url, true);
  var product_id = query1.query.pid;
  var temprature = query1.query.temp;
  var humidity = query1.query.humid;
  var powerOfHyd = query1.query.ph;
  var co_leve = query1.query.co;
  var light = query1.query.uv;


   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO test_table (product_id, temprature, humidity, ph, co_leve, light) VALUES ( \'' + product_id +'\' , \''+ temprature + ' \' , \' '+humidity+'\' , \''+ powerOfHyd+'\' , \''+co_leve+'\' , \''+light+ '\')', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});

/* Inserting Sensor Data via POST
app.post('/insertData', function (request, response) {


   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(' // Query // ', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});
*/




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


