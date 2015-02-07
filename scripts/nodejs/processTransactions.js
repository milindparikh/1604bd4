var JSONStream = require('JSONStream');
var fs = require('fs');

var redis = require("redis"),
    client = redis.createClient();


// *******************************************************
// *******************************************************
// ********* CNT Format **********************************
// HASH  -> CNT:<n>:<entity-type>



var cbs = []
var numberofdays = 100;




registercb(function (record) {
    // ***** total number of transactions **** 
    // ** cnt:0:cumulative:transactions ** 

    console.log(record.id);
    
    client.incr("cnt:0:cumulative:transactions");

});


registercb(function (record) {
    // ***** set of unique customers **** 
    // ** set:0:cumulative:customers **
    client.sadd("set:0:cumulative:customers", record.customerid);


});


registercb(function (record) {
    // ***** the number of transactions per customer ****
    // ***** cnt:0:cumulative:transactionspercustomer  <customerid> 
    
    client.hincrby("cnt:0:cumulative:transactionspercustomer", record.customerid, 1);

});


registercb(function (record) {
    // ***** set of unique ips per customer **** 
    // ** set:0:cumulative:ipspercustomer:<customerid> **
    
    if (typeof record.attributes.ip == 'undefined') {
    }else {
	
	client.sadd("set:0:cumulative:ipspercustomer:"+record.customerid, record.attributes.ip);
    }


});








main();
function main() {
    if (process.argv[2] == 1) {
	readAndProcessFile();
    }
}



function readAndProcessFile() {
    fs.createReadStream('data.json')
	.pipe(JSONStream.parse('transactions.*'))
	.on('data', function (data) { processTransaction(data); })
    
}





function processTransaction (transaction) {
    executecbs(transaction);
}



function  registercb(cb) {
    cbs.push(cb);
}

function executecbs(record) {
    cnt = cbs.length;
    
    while (cnt > 0) {	
	cb = cbs[cnt-1];
	cb(record);
	cnt--;
    }
}



var i = function processTransaction (obj) {
    console.log(obj.id);
};

