

var redis = require("redis"),
    client = redis.createClient();

var sha1 = require('sha1');

main();
function main() {

    
    createTransactions(parseInt(process.argv[2]), parseInt(process.argv[3]), function (transactions) {

	var metaTransactions = {};
	metaTransactions['transactions'] = transactions;
	
	
	console.log(JSON.stringify(metaTransactions));
	client.quit();
    });
    
}


function createTransactions(transCount, transStart, cb) {

    
    transactions = [];

    numTrans = 0;

    function processTransaction () {

	numTrans++;
	if (numTrans == transCount) {
	    cb(transactions);
	}
    }

    for (var cnt = 0; cnt < transCount; cnt++) { 

	client.get("total:customers", function (err, customers) {

	    var customerId = getRandomInt(1, parseInt(customers));
	    client.hget("customer:"+customerId, 'firstname', function (err2, firstname) {
		client.hget("customer:"+customerId, 'lastname', function (err3, lastname) {
		    client.hget("customer:"+customerId, 'city', function (err4, city) {
			client.hget("customer:"+customerId, 'state', function (err5, state) {
			    client.hget("customer:"+customerId, 'zipcode', function (err6, zipcode) {

				var d = new Date();
				var transId = sha1( ( d.getTime() + getRandomInt(1,10000)).toString());		    
				var transaction = {};
				
				var transValue = getRandomInt(1, 20000);
				transaction['id'] = transId;
				transaction['value'] = transValue;
				transaction['customerid']= customerId;
				transaction['attributes'] = {};
				transaction['attributes']['customername'] = firstname + " " + lastname;

				var op = getRandomInt(1, 3);

				if (op == 1) {

				    transaction['attributes']['city'] = city;
				    transaction['attributes']['state'] = state;
				    transaction['attributes']['zipcode'] = zipcode;
				    transactions.push(transaction);
				    processTransaction();
				    
				}
				else {
				    if (op == 2) {

					findRandomIp( function (randomip) {
					    transaction['attributes']['ip'] = ipv4(randomip);
					    transactions.push(transaction);
					    processTransaction();
					});
					

				    }
				}
			    });
			});
		    });
		});
	    });
	});
    }
}







// findRandomIp( function (randomip) {
//    var retVal = ipv4(randomip);
//    console.log(retVal);
//});



function findRandomIp (cb) {
    client.get("total:ipranges", function (err, ipranges) {

	ipranges = ipranges - 2;
	
	randomIpRange = getRandomInt(0, ipranges);


	
	client.get("iprange:startip:"+randomIpRange, function (err2, startip) {
	    client.get("iprange:endip:"+randomIpRange, function (err2, endip) {
		diffip = endip - startip;

		randomip = getRandomInt(0, diffip);
		randomip = parseInt(startip) + randomip;
		cb(randomip);
		
	    });
	});
	
    });
    
    
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



function ipv4(ipnum) {
    var cnt = 3;
    var retVal = "";
    
    while (cnt > 0) {
	retVal = retVal +    Math.floor(ipnum/Math.pow(256,cnt)) + ".";
	ipnum = ipnum - Math.floor(ipnum/Math.pow(256,cnt))*Math.pow(256,cnt);
	cnt--;
    }
    retVal = retVal + ipnum;
    

    return retVal;
}

function findCommon(from, to) {
    
    var cnt = 3;
    while (cnt > 0) {
	console.log(from );
	console.log(to);
	
	if ( Math.floor ( from / Math.pow(256,cnt)) == Math.floor ( to / Math.pow(256,cnt))) {
	    
	    from = from - Math.floor(from / Math.pow(256,cnt))*Math.pow(256,cnt);
	    to = to - Math.floor( to / Math.pow(256,cnt))*Math.pow(256,cnt);
	    cnt--;
	}
	else {
	    return cnt;
	}
    }
    return 0;
    
}


    
