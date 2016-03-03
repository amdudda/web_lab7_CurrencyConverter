var express = require("express");
var router = express.Router();

/* GET the app's home page */
router.get('/',homepage);

function homepage(req, res) {
	//res.send("<html><body><h1>Currency site</h1></body></html>");
	res.render('index');  // this renders the named view (index.jade)
}

/* GET request, for form submit */
router.get('/convert', convert);

// this function handles form submission data
function convert(req, res) {
	/* 
		Data send as a post request is available in the
		body.query attribute; properties same as names in form.
	 */

	var units = req.query.dollaramount;
	var convertFrom = req.query.fromcurrency;
	var convertTo = req.query.tocurrency;
	var symbol;
	if (convertTo == "EUR") symbol = "€"; 
		else if (convertTo == "USD") symbol = "US$";
		else symbol = "GB₤"; 

	// log the conversion
	console.log("query was: convert " + convertFrom + " " + units + " to " + convertTo + " (" + symbol + ")");

	// fetch my api key
	var apikey = process.env.CURRENCYLAYER_API_KEY;
	
/*	
	construct our url to fetch conversion rates
	the values returned will be in the format "USD" plus currency symbol, eg "USDEUR"
	this will need to be an async call - can't do anything else till we have this data.
	API documentation is at https://currencylayer.com/documentation
*/
	var api_url = "http://apilayer.net/api/live?access_key=f" + apikey +  			"&currencies=USD,EUR,GBP&format=1";  // format 1 specifies JSON
	// TODO: the api has a call that lets you get all available currencies.
	// this could be used to generate drop-down boxes.
	
	// our conversion rates generated via api call
	var api_conversions = ""; // how to fetch this??
/*	original hard-coded values */
	var conversions = 
		{
		"USD": { "USD" : 1.00, "GBP" : 0.72, "EUR" : 0.91 },
		"EUR": { "USD" : 1.10, "GBP" : 0.79, "EUR" : 1.00 },
		"GBP": { "USD" : 1.40, "GBP" : 1.0, "EUR" : 1.27 }
		}  // exchange rates approximate; googled these on 2016.02.25

	var conversionRate = conversions[convertFrom][convertTo];
	//	console.log(conversionRate);

	// do the math, but also round the calculation to two decimal places.
	var convertedVal = conversionRate * units;
	var convertedVal = Math.round(convertedVal*100) / 100;

	// send the results to the browser.
	res.render('result', {dollars:units, symbol:symbol, converted:convertedVal});
};

module.exports = router;
