///////////////////////////
// Dependencies
///////////////////////////

const express    	  = require('express'),
	  app 	     	  = express(),
	  bodyParser 	  = require('body-parser'),
	  mongoose   	  = require('mongoose'),
	  methodOverride = require('method-override');


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
// Override POST request to PUT in HTML form
app.use(methodOverride('_method'));


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

// INDEX route
app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err) {
			console.log('error')
		} else {
			res.render('index', {blogs: blogs});
		}
	})

})

// NEW route
app.get('/blogs/new', (req, res) => {
	res.render('new')
});

// CREATE route
app.post('/blogs', (req, res) => {
	// create blog
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err) {
			res.render('new');
		} else {
			res.redirect('/blogs');
		}
	})
	// redirect
})

// SHOW route
app.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render('show', {blog: foundBlog});
		}
	})
})

// EDIT route
app.get('/blogs/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render('edit', {blog: foundBlog});
		}
	})
})

// UPDATE route
app.put('/blogs/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect(`/blogs/${req.params.id}`);
		}
	})
})

// DELETE route
app.delete('/blogs/:id', (req, res) => {
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, err => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	})
	//redirect
})


///////////////////////////
// LOCAL DEV SERVER
///////////////////////////

app.listen(3000, () => {
	console.log('App running on localhost:3000');
})

























