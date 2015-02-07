var redis = require("redis"),
    client = redis.createClient();

var sha1 = require('sha1');


client.on("error", function (err) {
    console.log("Error " + err);
});


var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var swig  = require('swig');


app.use(cookieParser());
app.use("/static", express.static(__dirname + '/public'));
app.use("/dynamic", express.static(__dirname + '/dynamic'));


app.get('/', function (req, res) {
    client.get("total:users", function (err, totalusers) {
    if (typeof req.cookies.sessionid === "undefined") {
	sessionid = sha1(Math.random());
	client.hset("sessions", sessionid, 1);
	res.cookie('sessionid', sessionid);
    }
	var tpl = swig.compileFile('uiformetrics.template');
	
	res.send(tpl({ pagename: 'awmome',
		  includedjs: ["/static/dat.gui.js"],
		  defvals: {"\'dat.gui\'" : 'message', 0.8: 'speed'},
		  rangevals: {"\'message\'": "", "\'speed\'": ", 0,10" }}));
    });
})


app.post('/scard', function (req, res) { 
    
    var content = '';
    
    req.on('data', function (data) {
       // Append data.
	content += data;
    });
    
   req.on('end', function () {
       // Assuming, we're receiving JSON, parse the string into a JSON object to return.
       
       var data = JSON.parse(content);
       console.log(data.query);

       client.scard(data.query, function (err, cardinality) {
	   
	   var hashResponse = {'value': cardinality};
	   var jsonQRes = JSON.stringify(hashResponse);
	   res.contentType('application/json');

	   
	   res.send(jsonQRes);
	   
       });
   });
    
});





app.post('/smem', function (req, res) { 
    
    var content = '';
    
    req.on('data', function (data) {
       // Append data.
	content += data;
    });
    
   req.on('end', function () {
       // Assuming, we're receiving JSON, parse the string into a JSON object to return.
       
       var data = JSON.parse(content);
       console.log(data.query);

       client.smembers(data.query, function (err, smembers) {
	   
	   var hashResponse = {'value': smembers};
	   var jsonQRes = JSON.stringify(hashResponse);
	   res.contentType('application/json');

	   
	   res.send(jsonQRes);
	   
       });
   });
    
});





app.get('/total.stats', function (req,res) {
    console.log(req.cookies.sessionid);
    
    client.get("cnt:0:cumulative:transactions", function (err, transactions)  {
	client.scard("set:0:cumulative:customers", function (err, customers)  {
	    res.contentType('application/json');
	    var stats = [ {'customers': customers}, {'transactions': transactions} ];
	    statsJSON = JSON.stringify(stats);
	    console.log(statsJSON);
	    res.send(statsJSON);
	});
    });
})



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('App for metrics listening at http://%s:%s', host, port)

})
