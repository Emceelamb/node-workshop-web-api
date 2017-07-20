var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var app = express();

app.listen('8080');
console.log('App running on port 8080');

app.get('/', function(error, response ,request){
    response.send('App is running on 8080');
})

function fetchWeb(url){
    var url = 'https://vietnam.craigslist.org/search/mca'
    console.log('fetching...', url);
    request(url, function(err,res,body){
        if(err){
            console.log(err);
        }

       console.log(body);
        console.log('...done!!!')
        var $ = cheerio.load(body);
        var titles = [];
        var prices = [];
        var cities = [];
        $('.result-title').each(function(index,element){
            titles[index] = $(this).text();
        })
        // console.log(titles);
        $('.result-price').each(function(index,element){
            prices[index] = $(this).text();
        })
        $('.result-hood').each(function(index,element){
            var city = $(this).text();
            cities[index] = city.slice('2',city.length-1)
        })
        for(var i = 0; i<titles.length; i++){
            console.log(titles[i]+ ', ' + prices[i] + ', ' + cities[i])
        }

        var results = {
            motos: []
        }

        for(var i = 0; i<titles.length; i++){
            var moto = {
                'title': titles[i],
                'prices': prices[i],
                'cities': cities[i]
            }
            results.motos.push(moto);
        }
        writeToFile(results);
        
        console.log('wrote to file');    
    })
}


function writeToFile(data){
    var writeable_data = JSON.stringify(data);
    console.log('writing to file');
    fs.writeFile('motos.json', writeable_data);
}

// fetchWeb();

app.get('/show-motos', function(request, response, error){
   // response.send("this is where we will send motos");
   var theData;
   fs.readFile('motos.json', function(err, data){
       if (err){console.log(err)}
       console.log('read the file');
       theData = JSON.parse(data);
    //    
    if(request.query.cities == null){
        response.send(theData);
    } else {
        console.log('something else ')
        var result = {
            'listing':[]
        }
        for (var i = 0; i <theData.motos.length; i++){
            var current_listing = theData.motos[i];
            var current_location = current_listing.cities;
            if(current_location == request.query.cities){
                result.listing.push(current_listing);
                // response.send('query')
            }
            
        }
        response.json(result);
    }
   })
   
        console.log('the query:', request.query);   
})

app.get('/get-the-data',function(){
    fetchWeb();
    console.log('got the data');
})