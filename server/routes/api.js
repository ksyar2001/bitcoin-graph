// const express = require('express');
// const router = express.Router();
// var RSMQWorker = require("rsmq-worker");
// var worker = new RSMQWorker("myqueue");

// /* GET api listing. */
// router.get('/', (req, res) => {
//   res.send('api works');
// });

// router.get('/posts', (req, res) => {
// 	res.status(200).json({userid: "123", pwd: "123"});
// });

// router.get('/test', function(req, res) {
// 	worker.send("MESSAGE");
// });

// module.exports = router;
const http = require('request-promise')
const options = {
	method: 'GET',
	uri: 'https://bittrex.com/api/v1.1/public/getticker?market=usdt-btc',
	json: true
}

module.exports = function(app) {
	app.get('/api/', (req, res) => {
		res.send('api works');
	});

	app.get('/api/posts', (req, res) => {
		http(options).then(response => res.status(200).json(response));
	});

	app.get('/api/test', function(req, res) {
		// app.worker.send("MESSAGE");
	});
}