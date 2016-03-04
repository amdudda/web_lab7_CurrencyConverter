var express = require("express");
var router = express.Router();
var request_mod = require("request");

/* GET the app's home page */
router.get('/',homepage);

function homepage(req, res) {
	// The api has a call that gets a list of all available currencies.
	// this could be used to generate massive drop-down boxes.  
	var api_url = "http://apilayer.net/api/list";	// url for list of currencies
	var apikey = process.env.CURRENCYLAYER_API_KEY;  // fetch my api key
	var api_param = { 'access_key':apikey } ;  // and set it as a parameter for the call

	request_mod( {uri: api_url, qs: api_param}, function(error,clresponse,body) {
		if (!error && clresponse.statusCode == 200) {
			// parse out the currencies and loop through them to create options
			var my_data = JSON.parse(body);
			if (my_data.success) {
				var my_currencies = my_data.currencies;
				var currency_options = "";
				for (var currency in my_currencies) {
					currency_options += "| <option value='" + currency + "'> " + my_currencies[currency] + "</option>\n";
				}
				// render the named view (index.jade) and pass my list of available currencies to the page.
				res.render('index',{currencies_list:currency_options});  
			} else {
				// process error info in JSON data
				var errcode = my_data.error.code;
				var errtype = my_data.error.type;
				var errtext = my_data.error.info;
				// and pass this to an error page
				res.render('error',{errcode:errcode,errtype:errtype,errtext:errtext});
			} // end if-else for processing JSON data
		}
		else if (!error) {
			// fall back in a more appropriate fashion - tell the user something
			// went wrong in the HTML request.
			if (clresponse) var errcode = clresponse.statusCode;
				else var errcode = "Unable to retrieve error code";
			var errtype = "HTML error";
			var errtext = "Something happened in communications between your computer and the server on the Internet.  You can do a web search on the error code above to find more details about the error.";
			// and pass this to an error page
			res.render('error',{errcode:errcode,errtype:errtype,errtext:errtext});
		}
		else {
			var errcode = "Unable to retrieve error code";
			var errtype = "Error in program";
			var errtext = "Something broke in the code.  Nag me at tk0654wm@go.minneapolis.edu to fix it.";
			// and pass this to an error page
			res.render('error',{errcode:errcode,errtype:errtype,errtext:errtext});
		} // end if-else for processing request_mod response
	}); // end request callback
} // end homepage function

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
	var toSymbol="";
	var fromSymbol="";
	// pre-staging for introducing other currencies
	if (convertTo == "EUR") toSymbol = "€";
		else if (convertTo == "USD") toSymbol = "US$";
		else if (convertTo == "GBP") toSymbol = "GB₤"; 
		else toSymbol = convertTo;
	if (convertFrom == "EUR") fromSymbol = "€"; 
		else if (convertFrom == "USD") fromSymbol = "US$";
		else if (convertFrom == "GBP") fromSymbol = "GB₤"; 
		else fromSymbol = convertFrom;
	console.log("from " + fromSymbol + " to " + toSymbol);

	// log the conversion
	console.log("query was: convert " + fromSymbol + " " + units + " to " + convertTo + " (" + toSymbol + ")");

	// fetch my api key
	var apikey = process.env.CURRENCYLAYER_API_KEY;
	
/*	
	construct our url to fetch conversion rates
	the values returned will be in the format "USD" plus currency symbol, eg "USDEUR"
	this will need to be a callback function - can't do anything else till we have this data.
	API documentation is at https://currencylayer.com/documentation
*/
	var api_url = "http://apilayer.net/api/live" 
	var api_params = {'access_key': apikey, format:1 } // format 1 specifies JSON, formerly 'currencies':'USD,EUR,GBP',
	var api_or_hard = "";
	var convertedVal = 0;

	// our conversion rates generated via api call
	request_mod( {uri: api_url, qs: api_params}, function(error,clresponse,body) {
		if (!error && clresponse.statusCode == 200) {
			var api_conversions = JSON.parse(body); 
			// check for data retrieval success
			if (api_conversions.success) {
				//console.log(api_conversions.quotes);
				var target = api_conversions["quotes"]["USD" + convertTo];
				var base = api_conversions["quotes"]["USD" + convertFrom];
				convertedVal = units * (target/base);
				api_or_hard = "used the API";
			}
			else  {
				// process error info in JSON data
				var errcode = api_conversions.error.code;
				var errtype = api_conversions.error.type;
				var errtext = api_conversions.error.info;
				// and pass this to an error page
				res.render('error',{errcode:errcode,errtype:errtype,errtext:errtext});
			} // end if-else for processing JSON data
		}
		else if (!error) {
			// fall back in a more appropriate fashion - tell the user something
			// went wrong in the HTML request.
			if (clresponse) var errcode = clresponse.statusCode;
				else var errcode = "Unable to retrieve error code";
			var errtype = "HTML error";
			var errtext = "Something happened in communications between your computer and the server on the Internet.  You can do a web search on the error code above to find more details about the error.";
			// and pass this to an error page
			res.render('error',{errcode:errcode,errtype:errtype,errtext:errtext});
		}
		else {
			var errcode = "Unable to retrieve error code";
			var errtype = "Error in program";
			var errtext = "Something broke in the code.  Nag me at tk0654wm@go.minneapolis.edu to fix it.";
			// and pass this to an error page
			res.render('error',{errcode:errcode,errtype:errtype,errtext:errtext});
		} // end if-else for processing request_mod response

		// round the calculation to two decimal places.
		convertedVal = Math.round(convertedVal*100) / 100;

		// send the results to the browser.
		res.render('result', {fromSymbol:fromSymbol, dollars:units, toSymbol:toSymbol, converted:convertedVal});
	}); // end callback function and close request
};

module.exports = router;
