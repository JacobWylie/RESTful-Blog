///////////////////////////
// Dependencies
///////////////////////////

const express    = require('express'),
	  app 	     = express(),
	  bodyParser = require('body-parser'),
	  mongoose   = require('mongoose');


///////////////////////////
//	MIDDLEWARE
///////////////////////////

// Connect to local db
mongoose.connect('mongodb://localhost/restful_blog', {useMongoClient: true});
// Use ejs templating
app.set('view engine', 'ejs');
// Serve css and js files from /public
app.use(express.static('public'));
// Parse data through POST forms
app.use(bodyParser.urlencoded({extended: true}));


///////////////////////////
// MONGOOSE/MODEL CONFIG
///////////////////////////

// Mongodb database schema
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
// Compile schema into mongoose model
const Blog = mongoose.model('Blog', blogSchema);


///////////////////////////
// RESTFUL ROUTES
///////////////////////////

// ROOT -> INDEX
app.get('/', (req, res) => {
	res.redirect('/blogs');
})

// INDEX - 
app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err) {
			console.log('error')
		} else {
			res.render('index', {blogs: blogs});
		}
	})

})


///////////////////////////
// LOCAL DEV SERVER
///////////////////////////

app.listen(3000, () => {
	console.log('App running on localhost:3000');
})
























