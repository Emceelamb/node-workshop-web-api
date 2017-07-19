// import modules
// use the directive require

var http = require('http');
// start the server
http.createServer(function(req,res){
    res.write(motos); // send the file we read 
    res.end() // ends response
    
}).listen(8080);

// lets read a file
// !!!! First make the file to be read !!!

// import file system module
var fs = require('fs');

// read file
var motos = fs.readFileSync("motos.txt", "utf8");

// lets print the file for success
console.log(motos);