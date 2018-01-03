const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");

//app settings
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(express.static("public")); // (start serving static files)


// connect to db
var mongooseOption = {
    promiseLibrary: global.Promise,
    useMongoClient: true,
    keepAlive: true
};

// 
mongoose.connect("mongodb://hongtselin:Paul124741450@ds239097.mlab.com:39097/restful-blog-site", mongooseOption);
// mongoose.connect("mongodb://localhost/restful_blog_app", mongooseOption);

// mongoose model settings
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// clean data base
Blog.remove({}, function(err){
    if(err){
            console.log(err);
        } else {
            console.log("Blogs removed!!!");
        }
});

// create seed data
data = [
    {
        title: "Test blog1",
        image: "https://source.unsplash.com/rxPqkK0hp3c/400x225",
        body: "This is my first blog post"
    },
    {
        title: "Test blog2",
        image: "https://source.unsplash.com/YWAVTqGnyjI/400*225",
        body: "What a good day "
    },
    {
        title: "Substring fox!",
        image: "https://source.unsplash.com/7TGVEgcTKlY",
        body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    }
];

data.forEach(function(seed){
    Blog.create(seed, function(err, blog){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("blog created!!");
        }
    });
});

///////////// RESTful routes start

// the index route
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});


// the new route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});


// the create route
app.post("/blogs", function(req, res) {
    // retrive the blog and save into db
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            // if err go back to the new form
            res.redirect("blogs/new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});


// the show route
app.get("/blogs/:id", function(req, res) {
    let blogID = req.params.id;
    Blog.findById(blogID, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    });
});


// the edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

// the update route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


// the delete route
app.delete("/blogs/:id", function(req, res) {
    // destroy blog and redirect to index route
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    });
});


// start server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server start!!");
});
