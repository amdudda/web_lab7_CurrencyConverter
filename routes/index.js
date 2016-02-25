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
	if (convertTo == "Euros") symbol = "€"; 
		else if (convertTo == "Dollars") symbol = "$";
		else symbol = "GB₤"; 

	// log the conversion
	console.log("query was: convert " + convertFrom + " " + units + " to " + convertTo + " (" + symbol + ")");

	// our conversion rates
	var conversions = {
		"Dollars": { "Dollars" : 1.00, "Pounds" : 0.72, "Euros" : 0.91 },
		"Euros": { "Dollars" : 1.10, "Pounds" : 0.79, "Euros" : 1.00 },
		"Pounds": { "Dollars" : 1.40, "Pounds" : 1.0, "Euros" : 1.27 }
		}  // exchange rates approximate; googled these on 2016.02.25
	var conversionRate = conversions[convertFrom][convertTo];
//	console.log(conversionRate);

	var convertedVal = conversionRate * units;
	var convertedVal = Math.round(convertedVal*100) / 100;

	// send the results to the browser.
	//res.send("US$" + dollars + " converts to " + symbol + convertedVal);
	res.render('result', {dollars:units, symbol:symbol, converted:convertedVal});
};

module.exports = router;
