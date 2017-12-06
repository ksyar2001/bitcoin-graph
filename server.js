// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const NR = require('node-resque');

const app = express();

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
});

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

///////////////////////////
// SET UP THE CONNECTION //
///////////////////////////
 
var connectionDetails = {
  pkg:       'ioredis',
  host:      '127.0.0.1',
  password:  null,
  port:      6379,
  database:  0,
  // namespace: 'resque',
  // looping: true,
  // options: {password: 'abc'},
};
 
//////////////////////////////
// DEFINE YOUR WORKER TASKS //
//////////////////////////////
 
var jobs = {
  "add": {
    plugins: [ 'jobLock', 'retry' ],
    pluginOptions: {
      jobLock: {},
      retry: {
        retryLimit: 3,
        retryDelay: (1000 * 5),
      }
    },
    perform: function(a,b,callback){
      var answer = a + b;
      callback(null, answer);
    },
  },
  "subtract": {
    perform: function(a,b,callback){
      var answer = a - b;
      callback(null, answer);
    },
  },
};
 
////////////////////
// START A WORKER //
////////////////////
 
var worker = new NR.worker({connection: client, queues: ['math', 'otherQueue']}, jobs);
worker.connect(function(){
  worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
  worker.start();
});
 
 
/////////////////////////
// REGESTER FOR EVENTS //
/////////////////////////
 
worker.on('start',           function(){ console.log("worker started"); });
worker.on('end',             function(){ console.log("worker ended"); });
// worker.on('cleaning_worker', function(worker, pid){ console.log("cleaning old worker " + worker); });
// worker.on('poll',            function(queue){ console.log("worker polling " + queue); });
// worker.on('job',             function(queue, job){ console.log("working job " + queue + " " + JSON.stringify(job)); });
// worker.on('reEnqueue',       function(queue, job, plugin){ console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
// worker.on('success',         function(queue, job, result){ console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
// worker.on('failure',         function(queue, job, failure){ console.log("job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
// worker.on('error',           function(queue, job, error){ console.log("error " + queue + " " + JSON.stringify(job) + " >> " + error); });
// worker.on('pause',           function(){ console.log("worker paused"); });
 
////////////////////////
// CONNECT TO A QUEUE //
////////////////////////
 
var queue = new NR.queue({connection: connectionDetails}, jobs);
queue.on('error', function(error){ console.log(error); });
queue.connect(function(){
});
// setInterval(function() {
//   queue.enqueue('math', "add", [1,2]);
//   queue.enqueue('math', "add", [101,102]);
// }, 5000)


// Get our API routes
require('./server/routes/api')(app);

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

var io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log("Client connected");
  io.emit('message', {type:'new-message', text:"body"});
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
	console.log(`API running on localhost:${port}`);
});
