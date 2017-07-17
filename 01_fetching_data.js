// import packages

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

// start server
app.listen('42000');

// test server by going to localhost:42000
console.log('server running on 42000.. check at localhost:42000')

// send server response

app.get('/', function(err,res,req){
  res.send('hello to you we are going to make a craigslist scraper');
})

// function to fetch webpage
function fetchWeb(url){
  // declare url to fetch
  url =  'https://vietnam.craigslist.org/search/mca';
  console.log('fetching ', url, '...');
  request(url, function(err,res,req){
    if(err){
    console.log('did we get an error?', err);
    }
    // log response..
    console.log('what are the details of our response?', res.statusCode);
    console.log('----');

    // display request
    console.log(req);
    // log complete statement
    console.log('...done!')
  });
}

fetchWeb();
