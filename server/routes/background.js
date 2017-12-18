const redis = require('redis');
const NR = require('node-resque');
const http = require('request-promise')

const api_list = {
  bittrex : {
    method: 'GET',
    uri: 'https://bittrex.com/api/v1.1/public/getticker?market=usdt-btc',
    json: true
  },
  liqui: {
    method: 'GET',
    uri: 'https://api.liqui.io/api/3/trades/btc_usdt?limit=1',
    json: true
  },
  bitfinex: {
    method: 'GET',
    uri: 'https://api.bitfinex.com/v1/trades/BTCUSD?limit_trades=1',
    json: true
  }
};

module.exports = function(io){
  // this.connectionDetails = {
  //   pkg:       'ioredis',
  //   host:      process.env.REDIS_URL,
  //   password:  null,
  //   port:      process.env.REDIS_PORT | 6379,
  //   database:  0,
  // };
  // var redisClient = new Redis()

  // this.connectionDetails = {redis: }

  this.jobs = {
    "callApi": {
      perform: function(exchangeSite, callback) {
        var options = api_list[exchangeSite];
        if (exchangeSite == "bittrex") {
          http(options).then(res => {
            result = res.result;
            result["exchange"] = "bittrex"
            callback(null, result);
          });
        } else if (exchangeSite == "liqui") {
          http(options).then(res => {
            result = res.btc_usdt[0];
            result["exchange"] = "liqui";
            callback(null, result)
          });
        } else {
          http(options).then(res => {
            result = res[0];
            callback(null, result)
          })
        };
      }
    }
  };
    
  this.initialize = function() {
    var client = redis.createClient(process.env.REDIS_URL);
    client.on('connect', function() {
      console.log(`Redis client running at ${process.env.REDIS_URL}`);
    })
    
    var worker = new NR.worker({connection: client, queues: ['Api']}, this.jobs);
    worker.connect(function() {
    worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
    worker.start();
  });
    worker.on('start', function(){ console.log("worker started"); });
    worker.on('end', function(){ console.log("worker ended"); }); 
    worker.on('success', function(queue, job, result){
      console.log("job success " + queue + " " + " >> " + JSON.stringify(result));
      //send the result to the client
      io.emit('message', result);
    });
    worker.on('error', (error, queue, job) => { console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`) })
    
    var queue = new NR.queue({connection: client}, this.jobs);
    queue.on('error', function(error){
      console.log("Setting Timeout");
      setTimeout(function(){worker.start();}, 10000);
    });
    queue.connect(function(){
      console.log("Queue Connected")
    });

    setInterval(function() {
      console.log("Calling the APIs");
      queue.length("api", function(error, num){console.log("Current Jobs in the Queue: " + num)})
      queue.enqueue('Api', "callApi", ["bittrex"]);
      queue.enqueue('Api', "callApi", ["liqui"]);
      queue.enqueue('Api', "callApi", ["bitfinex"]);
    }, 5000)
  }
}