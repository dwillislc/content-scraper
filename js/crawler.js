const crawler = require("crawler"); 
const url = require('url'); 
const request = require('request'); 
const writer = require("./csv_write.js");


const mikeUrl = 'http://shirts4mike.com/'
//List of shirt urls on main page 
var shirtData = {}; 
var shirtRecords = [];
var shirtLength; 
var count = 0; 


/*****************************************
Scrape URLs for Each Shirt on Main Webpage
******************************************/


//Scraper of main shirt webpage to get shirt urls
var mainPageScraper = new crawler({

	callback : function (error, res, done) {
		if (error) {
			console.log("There's an error!"); 
		} else {
			var $ = res.$; 
			getShirtUrls(res); 

			shirtlength = Object.keys(shirtData).length; 
			count = 0; 
			getAllDetails();
		}
		done();
	}
})

//Helper method to get each shirt url and image
var getShirtUrls = function (res) {
	let $ = res.$; 
	let shirts = $('ul.products li');
	for (let i = 0; i < shirts.length; i++) {
		//Parse URL to get shirt ID
		let shirtUrl = url.parse(shirts.eq(i).find('a').attr('href'), true);
		let shirtId = shirtUrl.query.id; 


		//Timestamp of when the price was scraped
		var time = new Date; 

		//Add shirt url and image to data object 
		shirtData[shirtId] = {}; 
		shirtData[shirtId]['url'] = shirts.eq(i).find('a').attr('href');
		shirtData[shirtId]['image'] = shirts.eq(i).find('img').attr('src');
		shirtData[shirtId]['time'] = time; 
	}
}

/*****************************************
Scrape shirt details from individual webpages
******************************************/

//Scraper for individual shirts to get detail info
var detailsScraper = new crawler({
	callback : function (err, res, done) {
		if (err) {
			console.error(err); 
		} else {
			let $ = res.$; 
			let resUrl = url.parse(res.request.uri.href, true);
			let shirtId = resUrl.query.id;
			
			getShirtDetails(res, shirtId);
			count ++; 
			if (count == shirtlength) {
				for (var shirt in shirtData){
					shirtRecords.push(shirtData[shirt]);
				}
				writer.writeRecords(shirtRecords);
			}
		}
		done(); 
	}
})

//Helper method to get shirt titles and prices 
var getShirtDetails = function (res, shirtId) {
	let $ = res.$;
	let details = $('div.shirt-details h1');
	let price = details.find('span').text();
	let title = details.text().replace(/[^A-Za-z ]+/g, '').trim();

	shirtData[shirtId]['title'] = title; 
	shirtData[shirtId]['price'] = price;
}

//Helper method to get details for each shirt detail webpage
var getAllDetails = function (length) {
	for (var shirt in shirtData) {
		let shirtUrl = mikeUrl + shirtData[shirt]['url'];
		detailsScraper.queue(shirtUrl);	
	}
}

//http://shirts4mike.com/shirts.php

var buildShirtData = function () {
	request('http://shirts4mike.com/shirts.php', function (error, response, body) {
		if (error) {
			console.log("Uh-oh, looks like there's something wrong with your link or network connection!");	
		} 
		else {
			mainPageScraper.queue('http://shirts4mike.com/shirts.php');
		}
	})
}

// buildShirtData();
module.exports.buildShirtFile = buildShirtData; 




 








