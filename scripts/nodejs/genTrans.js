

var redis = require("redis"),
    client = redis.createClient();


main();
function main() {
    createTransactions(parseInt(process.argv[2], process.argv[3]));
}


function createTransactions(transCount, transStart) {
    
    var transStart = 1000;
    
    transactions = [];

    for (var cnt = 0; cnt < transCount; cnt++) { 
	var transaction = {};
	var transId = transStart + cnt;
	var transValue = getRandomInt(1, 20000);
	transaction['id'] = transId;
	transaction['value'] = transValue;

	transactions.push(transaction);
    }


    console.log(JSON.stringify(transactions));
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


    
