var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'http://paas:456497bb9d985d1ce45f33817d2c6236@fili-us-east-1.searchly.com',
  log: 'trace'
});

/* var util = require('util'); //debugging */
 
var app = express();

app.use(serveStatic(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/endpoint', function(req, res) {
	//util.log(util.inspect(req)) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
    //util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
    /*
    if(req.body) {

	    var python = require('child_process').spawn(
		    'python',
		    // second argument is array of parameters, e.g.:
		    ["./dearabbey_spine.py", JSON.stringify(req.body)]
	    );
	    var output = "";
	    python.stdout.on('data', function(){ output += data });
	    python.on('close', function(code){ 
	    	if (code !== 0) {  return res.send(500, code); }
	    	return res.send(200, output)
	    });
	} else {
		res.send(500, 'No file found');
	}
	*/
	//console.log(req.body.query);
	var response = {"text":"DEAR OVER IT: Your husband's behavior is passive-aggressive, and I can't help but wonder what he's punishing you for. It's sad that he has such atrocious table manners and such little consideration for your feelings. I 'suggest' you stop trying to serve him a hot meal, let him get his own food from the kitchen and eat it in front of the television when he's hungry, while you eat separately -- preferably out with friends."};

	client.search({
	  index: 'articles',
	  type: 'article',
	  body: {
	    query: {
	      match: {
	        'question': req.body.query
	      }
	    }
	  }
	}).then(function (resp) {
	    var hits = resp.hits.hits;
	    res.send(hits[0]._source.question);
	}, function (err) {
	    console.trace(err.message);
	});


	
});

app.listen(3000);