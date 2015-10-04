var serveDirectory = "/Users/will/Desktop/MSCS/EECS 338/proj"
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(serveDirectory)).listen(8080);

/*
	var sys = require("util"),
	my_http = require("http");

	my_http.createServer(function(request,response){
	    console.log("I got kicked");
	    response.writeHeader(200, {"Content-Type": "text/plain"});
	    response.write("Hello World");
	    response.end();
	}).listen(8080);
	sys.puts("Server Running on 8080");
*/