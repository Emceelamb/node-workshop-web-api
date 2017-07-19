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
  res.send('hello to you!!! we are going to make a craigslist scraper!!<p>fetch data by accessing /get-data<p>view listings by accessing /get-listings');
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
    $('.result-title').each(function(index,element){
    // save the title to array
      titles[index] = $(this).text();
    })
    // log titles to console to check result
    //console.log(titles);

    // do the same for other elements
    var price = [];
    var location = [];
    $('.result-price').each(function(index,element){
      price[index] = $(this).text();
    })

    $('.result-hood').each(function(index,element){
      var loc = $(this).text();  
      location[index] = loc.slice('2',loc.length-2)
    })

    // lets log them to see the result
    for(var x = 0; x <titles.length; x++){
    console.log(titles[x] + ", " + price[x] + ", " + location[x]);
  }

  // SAVE ABOVE TO JSON
  // create object a variable called 'motos'
  var results ={
    motos:[]
  }
  // go through results
  for(var i = 0; i<titles.length;i++){
    var moto = {
      'title': titles[i],
      'price': price[i],
      'location': location[i]
    }
    results.motos.push(moto)
  }

  // log if correct
  console.log(results);
  writeToFile(results);
  });
}

// function to write data

function writeToFile(data){
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


// lets  create a route to view info

app.get('/get-listings',function(req,res,err){
  var fetched_data;

  // first read the file
  fs.readFile('data/motos.json', function(err,data){
      console.log('successfully read file');
      

    // then parse
      fetched_data = JSON.parse(data);
      
    // user requests are made by 'request.query'
    // query = {field:value}
    // looks like http://website.com/endpoint?field=value
    // if no query display all results  
      if(req.query.location==null){
        res.send(fetched_data);
      } else { // if there is a query we must process the data
          var result = {
              'listings':[]
          };

          // go through listings again

          for(var i =0; i <fetched_data.motos.length; i++){
              var current_listing  = fetched_data.motos[i];
              var current_loc = current_listing.location;

              // if current location matches requested location add it to the list
              if(current_loc == req.query.location){
                  result.listings.push(current_listing);
              }
          }

          // then respond with JSON
          res.json(result);
      }

  });
  console.log('new query:', req.query);
})
  
