// import modules
// use the directive require

var http = require('http');

// start the server
http.createServer(function(req,res){
    res.write('Hello world!'); // writes a response
    res.end() // ends response
    
}).listen(8080);
