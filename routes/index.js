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

	var dollars = req.query.dollaramount;
	var convertTo = req.query.tocurrency;
	var symbol;
	if (convertTo == "Euro") symbol = "€"; else symbol = "GB₤"; 


	//res.send("query was: convert US$" + dollars + " to " + convertTo + "(" + symbol + ")");
	console.log("query was: convert US$" + dollars + " to " + convertTo + "(" + symbol + ")");

	// our conversion rates - TODO what's wrong with this?
	var conversions = { "Pounds" : 1.6, "Euro" : 1.1 };

	var conversionRate = conversions[convertTo];

	var convertedVal = conversionRate * dollars;

	// send the results to the browser.
	//res.send("US$" + dollars + " converts to " + symbol + convertedVal);
	res.render('result', {dollars:dollars, symbol:symbol, converted:convertedVal});
};

module.exports = router;
