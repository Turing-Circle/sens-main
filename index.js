var express = require('express');
var cors = require('cors');
var app = express();
var pg = require('pg');
var url = require('url');
var nodemailer = require("nodemailer");


app.set('port', (process.env.PORT || 5000));
app.use(cors());
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
       { response.render('pages/showdata', {results: result.rows} ); }
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


app.get('/login',function(request,response){

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



app.get('/check',function(request,response){

	var query1 = url.parse(request.url, true);
	var name = query1.query.uname;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {

  	  client.query('SELECT email FROM userdata WHERE email = \'' + name +'\' ', function(err, result) {
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



app.get('/register',function(request,response){

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


//for sending email
app.get('/forgotPassword', function(request, response) {

	var query1 = url.parse(request.url, true);
	var name = query1.query.uname;


  var n = name.length;
  var newstr ="";
  var count;

    for(count = 0; count < n; count++)
    {

    	if(count == 0 || count%2 == 0)
        {
    		var a = name.charCodeAt(count)+1;
        }
        else
        {
        	var a = name.charCodeAt(count)-1;
        }
        var b = String.fromCharCode(a);
        newstr += b;

    }
    var name1 = newstr;


	pg.connect(process.env.DATABASE_URL, function(err, client, done) {

  	  client.query(' SELECT email FROM userdata WHERE email = \''+name +'\' ', function(err, result) {
  	  	done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/resetPassword', {results: result.rows} );
       }
    });
  });
});



//for replacing password in database
app.get('/updatepassword', function(request, response) {

  var query1 = url.parse(request.url, true);
  var name = query1.query.uname;
  var pass = query1.query.pass;

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {

      client.query('UPDATE userdata SET password = \'' + pass +'\' WHERE email = \'' + name + '\' ', function(err, result) {
        done();
      if (err)
       { console.error(err); response.send("Error " + err); }
    });
  });
});



// Inserting Sensor Data via GET
// SANJOTH'S WORK STARTS HERE
// https://sens-agriculture.herokuapp.com/insertData?pid=p1337&temp=23&humid=70&ph=30&co=111&uv=11
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

app.get('/resetSuccess', function(request, response) {
  response.render('pages/resetSuccess');
});

app.get('/loginForm', function(request, response) {
  response.render('pages/loginForm');
});

app.get('/signUp', function(request, response) {
  response.render('pages/signUp');
});

app.get('/visual.ejs', function(request, response) {
  response.render('pages/visual');
});

app.get('/progress', function(request, response) {
  response.render('pages/progress');
});


//for sending mail to in forgot password-case
app.get('/nodemail', function (request, response) {

  var query1 = url.parse(request.url, true);
  var f_email = query1.query.f_email;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
   auth: {
     user: 'sensagriculture@gmail.com',
     pass: '1234@asdf'
   }
 });

 var mailOptions = {
   from: 'agriculture@gmail.com',
   to: f_email,
   subject: 'Link to reset your password',
   text: 'Dear User, \n \n Please go to to the link below to reset your password: \n https://sens-agriculture.herokuapp.com/forgotPassword?uname='+f_email+'\n\n Thank you. \n\n Regards,\n Team SenS'
 };

 transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent: ' + info.response);
   }
 });
});

app.get('/showdata', function(request, response) {
  response.render('pages/showdata');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
