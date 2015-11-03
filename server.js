var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var util = require('util'); //debugging http requests

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

// route mgmt
app.get('/', function(request, response) {
	response.render('pages/index');
});

app.post('/results', function(req, res) {
    //util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url + '\npath: ' + req.path + '\nbody: ' + req.body) // debugging...
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

/* Search with Shingles
app.post('/results', function(req, res) {
    //util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url + '\npath: ' + req.path + '\nbody: ' + req.body) // debugging...
	client.search({
	  index: 'articles',
	  type: 'article',
	  body: {
	    query: {
	      bool: {
	      	should: [
	          { match: {
	                "submission_sh": req.body.query
	          }},
	          { match: {
	                "response_sh": req.body.query
	          }}
	        ]
		  }
	    },
	    rescore: {
	      window_size: 50,
	      query: {
	    	rescore_query: {
	    	  match_phrase: {
	    	    submission_sw: {
	    	  	  query: req.body.query,
	    	  	  slop: 50
	    	    }
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
*/
/*
app.post('/endpoint', function(req, res) {
	//util.log(util.inspect(req)) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
    //util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url

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
	    res.send(200, data);
	}, function (err) {
		console.log('Elasticsearch error:\n');
	    console.trace(err.message);
	});
});
*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});