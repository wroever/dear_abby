var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
/* var util = require('util'); //debugging http requests */

var app = express();

// set port to env variable if exists or 5000
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.render('pages/index');
});

// initialize database connection
var client = new elasticsearch.Client({
  host: 'http://paas:456497bb9d985d1ce45f33817d2c6236@fili-us-east-1.searchly.com',
  log: 'trace'
});

// route mgmt
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

	client.search({
	  index: 'articles',
	  type: 'article',
	  body: {
	    query: {
	      match: {
	        'submission': req.body.query
	      }
	    }
	  }
	}).then(function (resp) {
		// create a payload from the search results to send to client
	    var hits = resp.hits.hits;
	    var data = { "hits": [] }
	    if (hits.length != 0) {
	    	var n = 3; // number of results to include in payload
	    	for(i = 0; i < n; i++) {
	    		if (!!hits[i]) {
	    			data.hits.push(hits[i]);
	    		}
	    	}
	    }
	    res.send(data);
	}, function (err) {
		console.log('Elasticsearch error:\n');
	    console.trace(err.message);
	});

	
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});