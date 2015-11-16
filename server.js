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
	var output = '';
	py1 = childProcess.spawn('python',['python-test.py']);
	py1.stdout.on('data', function(data) {
		output += data;
	});
	py1.stdout.on('close', function (data) {
		console.log(output);
	});
	/*
	py2 = childProcess.spawn('python',['google-search.py','--query',req.body.query]);
	var output2 = '';
	py2.stdout.on('data', function(data) {
		output2 += data;
	});
	py2.stdout.on('close', function (data) {
		console.log(output2);
		res.render('partials/results.ejs', JSON.parse(output2));
	});
	py2.on('close', function (code) {
		console.log('process exited with status %d', code);
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