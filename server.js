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


// create routes to get data
app.get('/get-data', function(err,res,req){
  fetchWeb();
  res.send('fetching data');
})


// // create routes to read data
app.get('/get-listings', function(err,res,req){
  var fetched_data;
  fs.readFile('data/motos.json', function(err,data){
    console.log('reading data...');
    fetched_data = JSON.parse(data);
    // user requests are made by 'request.query'
    // query = {field:value}
    // looks like http://website.com/endpoint?field=value
    // if no query display all results
    if(req.query.cities===null){
      res.send(fetched_data);
    }
  // } else { // if there is a query we must process the data
  //   var result = {
  //     'listings':[]
  //   };
  //   // go through all listings
  //   for(var i =0; i <fetched_data.all_listings.length; i++){
  //     var current_listing = fetched_data.all_listings[i];
  //     var current_city = current_listing.cities;
  //     if(current_city == req.query.cities){
  //       //add to result list
  //       result.listings.push(current_listing);
  //     }
  //   }
  //   res.json(result);
  // }
  console.log('new query: ', req.query);

})
});

app.get('/get-all-listings', function(request, response, error){
  var fetched_data;

  //we first need to read our file, which is located in the 'data' folder, and called 'listings.json'
  fs.readFile('data/motos.json', function(error, data){
    console.log('successfully read file');

    //once we've read (loaded) the file, we need to parse it as JSON
    fetched_data = JSON.parse(data);

    //the user requests can be found in the 'request.query' object
    //query = {field:value} --- which in the URL looks like http://mywebsite.com/endpoint?field=value
    //if the user wants the whole thing
    if(request.query.boro == null){
      //if there is no specific query, let's just send back the whole thing
      response.send(fetched_data);

    }else{//else, if we have some sort of query, we need to do some data processing

      var result = {
        'listings' : []
      };

      //here we go through all the listings
      for(var i = 0; i < fetched_data.all_listings.length; i++){

        var current_listing = fetched_data.all_listings[i];
        var current_boro = current_listing.cities;


        //if the current boro matches the boro requested by the user...
        if(current_boro == request.query.cities){
		//we add that listing to our list
          result.listings.push(current_listing);
        }
      }

      //once we're done, we respond with JSON result
      response.json(result);
    }

  });

  console.log('new query:',request.query);
});
