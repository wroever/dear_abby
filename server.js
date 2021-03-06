// server.js
// node.js web server
var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var childProcess = require('child_process');
var ejs = require('ejs');

var app = express();
//var router = express.Router(); //express 4.0 adds router functionality

// set port to env $PORT if exists or 5000
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// initialize database connection
var client = new elasticsearch.Client({
	host: 'http://search-dearabbynu-cn4e6wgrkoo75lnpkia27iryhe.us-west-2.es.amazonaws.com',
	log: 'trace'
});

// Default route
app.get('/', function(request, response) {
	response.render('pages/index');
});

// var stopwords = ['I','a','about','an','are','as','at','be','by','com','for','from','how','in','is','it','of','on','or','that','the','this','to','was','what','when','where','who','will','with','the','www'];

// Google search queries
app.post('/google', function(req, res) {
	var query = req.body.query;
	//console.log('\nQuery: ' + query);
	// preprocess query
	/*
	q = tokenizer.tokenize(req.body.query);
	var query = '';
	for (var i = 0; i < q.length; i++) {
		if (stopwords.indexOf(q[i]) < 0) {
			query = query.concat(' ' + q[i]);
		}
	}
	console.log(query);
	*/

	/*
	var output = '';
	py1 = childProcess.spawn('python',['python-test.py']);
	py1.stdout.on('data', function(data) {
		output += data;
	});
	py1.stdout.on('close', function (data) {
		console.log(output);
	});
	*/
	var t = req.body.qtype;
	var script;
	if (t == 0) {
		script = 'gs-da.py';
	} else if (t == 1) {
		script = 'gs-ss.py';
	} else {
		script = 'gs-ds.py';
	}
	py = childProcess.spawn('python',[script,'--query',query]);
	var out = '';
	py.stderr.on('data', function(d) {
		//console.log(d);
	});
	py.stdout.on('data', function(d) {
		out += d;
	});
	py.stdout.on('close', function(d) {
		//console.log(out);
	});
	py.on('close', function (code) {
		//console.log('process exited with status %d', code);
		var data = JSON.parse(out);
	    app.render('partials/results.ejs', data, function (err, mkup) {
	    	res.setHeader('Content-Type', 'application/json');
	    	res.send(JSON.stringify({ html: mkup, hits: data.hits.length }));
	    });
	});
});

// ElasticSearch database queries
app.post('/results', function(req, res) {
	var t = req.body.qtype;
	var atype;
	var itype;
	if (t == 0) {
		atype = 'da_article';
		itype = 'dear_abby';
	} else if (t == 1) {
		atype = 'ss_article';
		itype = 'dear_harriette';
	} else {
		atype = 'sl_article';
		itype = 'dan_savage';
	}
	client.search({
	  index: 'articles',
	  type: atype,
	  body: {
	  	min_score: 0.5,
	    query: {
	      bool: {
	      	should: [
	          { match: {
	                "submission": req.body.query
	          }},
	          { match: {
	                "response": req.body.query
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
		                "submission": req.body.query
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
	    var data = { "hits": [], "img_type": itype }
    	var n = 3; // number of results to include in payload
    	for(i = 0; i < n; i++) {
    		if (!!hits[i]) {
    			data.hits.push(hits[i]);
    		}
    	}

	    app.render('partials/results.ejs', data, function (err, mkup) {
	    	res.setHeader('Content-Type', 'application/json');
	    	res.send(JSON.stringify({ html: mkup, hits: data.hits.length }));
	    });

	    //res.status(200).send(result_html);
	}, function (err) {
	    console.trace(err.message);
	    res.status(500).end();
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});