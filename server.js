var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var childProcess = require('child_process');

var app = express();
//var router = express.Router(); //express 4.0 adds router functionality

// set port to env variable if exists or 5000
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// initialize database connection
var client = new elasticsearch.Client({
	host: 'http://paas:9976e98d4aa969846497a583e29a0651@fili-us-east-1.searchly.com',
	log: 'trace'
});

// Default route
app.get('/', function(request, response) {
	response.render('pages/index');
});

// Google search queries
app.post('/google', function(req, res) {
	console.log('\nQuery: ' + req.body.query);
	py1 = childProcess.spawnSync('python',['python-test.py']);
	var data = py1.stdout.toString();
	console.log(data);
	py2 = childProcess.spawnSync('python',['google-search.py','--query',req.body.query]);
	console.log('process exited with status %d', py2.status);
	var data = py2.stdout.toString();
	console.log(data);
	res.render('partials/results.ejs', JSON.parse(data));

	/*
	var data = "";
	py.stdout.on('data', function (output) {
	  // encode stdout stream as json and append each result to hits
	  data += output;
	});

	py.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	py.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	  res.render('partials/results.ejs', JSON.parse(data));
	});
	*/

});

// ElasticSearch database queries
app.post('/results', function(req, res) {
	client.search({
	  index: 'articles',
	  type: 'article',
	  body: {
	    query: {
	      bool: {
	      	should: [
	          { match: {
	                "submission_sw": req.body.query
	          }},
	          { match: {
	                "response_sw": req.body.query
	          }}
	        ]
		  }
	    },
	    rescore: {
	      window_size: 50,
	      query: {
	    	rescore_query: {
		      bool: {
		      	should: [
		          { match: {
		                "submission_sh": req.body.query
		          }}
		        ]
			  }
	    	}
	      }
	    }
	  }
	}).then(function (resp) {
		// create payload from the search results to send to client
	    var hits = resp.hits.hits;
	    var data = { "hits": [] }
    	var n = 3; // number of results to include in payload
    	for(i = 0; i < n; i++) {
    		if (!!hits[i]) {
    			data.hits.push(hits[i]);
    		}
    	}

		res.render('partials/results.ejs', data);

	    //res.status(200).send(result_html);
	}, function (err) {
	    console.trace(err.message);
	    res.status(500).end();
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});