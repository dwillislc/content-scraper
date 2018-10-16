

const fs = require('fs'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const buildData = require('./js/crawler.js');


//Open data if it exists, otherwise create it
fs.mkdir("data", function(err) {
	if (err) {
		console.log("Data folder already exists!")
	} else {
		// Scrap and save data to CSV file in data 
		console.log("Data folder was created!"); 		
	}
});

buildData.buildShirtFile(); 

 