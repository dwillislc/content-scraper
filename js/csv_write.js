const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//Get date for file name 
var convertDate = function() {
	var date = new Date;
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); 
	var dd = date.getDate().toString(); 

	var mmChars = mm.split('');
	var ddChars = dd.split('');

	return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
} 

//Create file and write data to it
var writeRecords = function (shirtRecords) {

	var todayDate = convertDate(); 

	//Create header columns for csv file
	const csvWriter = createCsvWriter({
		path: './data/' + todayDate + '.csv',
		header: [
			{id: 'title', title: 'Title'},
			{id: 'price', title: 'Price'},
			{id: 'image', title: 'ImageUrl'},
			{id: 'url', title: 'URL'}, 
			{id: 'time', title: 'Time'}
		]
	});

	///Write data to the file
	csvWriter.writeRecords(shirtRecords)
	.then(() => {
		console.log('Data written to file'); 
	});
} 

module.exports.writeRecords = writeRecords; 
