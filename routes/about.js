var express = require('express');
var router = express.Router();

// NB - paths are relative to /about

/* GET about page */
router.get('/', about);

// and retrieve the page
function about (req,res) {
	console.log("Request about page");
	res.render('about');
};

module.exports = router;