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
    console.log('...done!');


  // load the  html
  var $ = cheerio.load(req);

  // creates empty array to look for
  var titles = [];
  var url = []
  var cities = [];
  var prices = [];

  // declare an object to be written

  var data_to_be_saved = {
    'all_listings': []
  };

  // search for html elements with class class = 'result-title'
  $('.result-title').each(function(index,element){
    //get title, url, city, and price from element
    titles[index] = $(element).text();
    url[index] = $(element).attr('href');
    cities[index] = url[index].slice('1', '4');
    // prices[index]=$(element).attr('.result-price');



  var listing = {
    'name': titles[index],
    'link': url[index],
    'cities':cities[index],
    // 'price':prices[index]
  }

  // add listings to objec to be saved
  data_to_be_saved.all_listings.push(listing);

   console.log(data_to_be_saved);

  // now we have to write to a file
  // writeToDisk();

  })
  writeToDisk(data_to_be_saved);

  });
}

// function to write data

function writeToDisk(data){
  // convert json object to string so we can save it as txt
  var writeable_data = JSON.stringify(data);
  console.log('writing..')
  // write to file using fs.writeFile()
  fs.writeFile('data/motos.json', writeable_data, function(){
    console.log('successfully written!' + writeable_data)
  })
}

fetchWeb();
