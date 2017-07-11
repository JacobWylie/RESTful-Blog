// Dependencies
const express    = require('express'),
	  app 	     = express(),
	  bodyParser = require('body-parser'),
	  mongoose   = require('mongoose');

// Connect to local db
mongoose.connect('mongodb://localhost/restful_blog', {useMongoClient: true});
// Use ejs templating
app.set('view engine', 'ejs');
// Serve css and js files from /public
app.use(express.static('public'));
// Parse data through POST forms
app.use(bodyParser.urlencoded({extended: true}));

// title
// image
// body
// created

// Local dev server
app.listen(3000, () => {
	console.log('App running on localhost:3000');
})
