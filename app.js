///////////////////////////
// Dependencies
///////////////////////////

const express    	   = require('express'),
	  app 	     	   = express(),
	  bodyParser 	   = require('body-parser'),
	  mongoose   	   = require('mongoose'),
	  methodOverride   = require('method-override'),
	  expressSanitizer = require('express-sanitizer'),
	  server           = require('http').Server(app),
	  // Allows Heroku to set port
	  port             = process.env.PORT || 8082;

// Connects to mLab db - sandbox free tier
mongoose.connect('mongodb://heroku_s25v6880:q8lvfeu1097soh3etk5vi057cv@ds153652.mlab.com:53652/heroku_s25v6880' || process.env.DATABASE_URL, {useMongoClient: true});
// Uses ejs templating
app.set('view engine', 'ejs');
// Serves css and js files from /public
app.use('/blog', express.static(__dirname + '/public'));
// Parses data through forms
app.use(bodyParser.urlencoded({extended: true}));
// Overrides POST request to PUT/DELETE in HTML form | No such method in HTML 5 yet
app.use(methodOverride('_method'));
// Removes <script> from HTML in form submissions for HTML markup in blog posts
app.use(expressSanitizer());


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
app.get('/blog', (req, res) => {
	res.redirect('/blog/blogs');
})

// INDEX route -> home/displays all blog posts
app.get('/blog/blogs', (req, res) => {
	// Retrieve all blog posts from db
	Blog.find({}, (err, blogs) => {
		if(err) {
			res.redirect('/blogs')
		} else {
			// Send posts to /index | array blogs[]
			res.render('index', {blogs: blogs});
		}
	})

})

// NEW route -> new blog post form
app.get('/blog/blogs/new', (req, res) => {
	res.render('new')
});

// CREATE route -> new blog post to db -> redirect back to index
app.post('/blog/blogs', (req, res) => {
	// Removes <script> from form submit HTML markup in blog content
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// Creates new blog post in db as mongoose model
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err) {
			res.render('new');
		} else {
			res.redirect('/blogs');
		}
	})
})

// SHOW route -> Particular blog post page
app.get('/blog/blogs/:id', (req, res) => {
	// Retreive blog post by id
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			// Send particular blog as object: 'blog'
			res.render('show', {blog: foundBlog});
		}
	})
})

// EDIT route -> edit post form
app.get('/blog/blogs/:id/edit', (req, res) => {
	// Retreive blog post by id
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			// Fills in form with retrieved blog's data as object: 'blog'
			res.render('edit', {blog: foundBlog});
		}
	})
})

// UPDATE route -> changes blog post content and redirects to same post SHOW
app.put('/blog/blogs/:id', (req, res) => {
	// Removes <script> from form submit HTML markup in blog content
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// Retreives blog by id and updates 
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect(`/blogs/${req.params.id}`);
		}
	})
})

// DELETE route -> removes post from db and redirects back to index
app.delete('/blog/blogs/:id', (req, res) => {
	// Retreives blog post by id and deletes it from db
	Blog.findByIdAndRemove(req.params.id, err => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	})
	//redirect
})

// Everywhere else leads to -> INDEX
app.get('*', (req, res) => {
	res.redirect('/blogs')
})


///////////////////////////
// LOCAL DEV SERVER
///////////////////////////

// app.listen(3000, () => {
// 	console.log('App running on localhost:3000');
// })


///////////////////////////
// HEROKU SERVER
///////////////////////////

// Allows Heroku to set port
server.listen(port, () => {
    console.log("App is running on port " + port);
});























