
var redis = require("redis"),
    client = redis.createClient();


var totalFirstNames = 5000;
var totalLastNames = 150000;
var totalZipCodes = 42000;

main () ;

function main() {

    var numofcustomers = process.argv[2];
    
    client.set("total:customers", numofcustomers);
    
    for (var cnt = 0; cnt <  numofcustomers; cnt++) {

	console.log(cnt);
	
	firstName = getRandomInt(0, totalFirstNames);
	lastName =  getRandomInt(0, totalLastNames);
	zipCode =  getRandomInt(0, totalZipCodes);
	getCustomer(cnt, firstName, lastName, zipCode);
    }
    
    
}

function getCustomer (id, firstName, lastName, zipCode) {

    client.get("fname:"+firstName, function (err, realFName) {
	client.get("lname:"+lastName, function (err, realLName) {
	    client.get("lname:"+lastName, function (err, realLName) {
		client.get("zip:zipcode:"+zipCode, function (err, realZipCode) {
		    client.get("zip:city:"+zipCode, function (err, city) {
			client.get("zip:state:"+zipCode, function (err, state) {
			    console.log(realFName + " " + realLName);

			    
			    client.hset("customer:"+id, 'firstname', realFName);
			    client.hset("customer:"+id, 'lastname', realLName);
			    client.hset("customer:"+id, 'city', city);
			    client.hset("customer:"+id, 'state', state);
			    client.hset("customer:"+id, 'zipcode', realZipCode);
			    
			    
			    
			});
		    });
		});
	    });
	});
    });
}



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

