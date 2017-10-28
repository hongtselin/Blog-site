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
mongoose.connect("mongodb://localhost/restful_blog_app", mongooseOption);


// mongoose model settings
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "test blog",
//     image: "https://unsplash.com/photos/o0RZkkL072U",
//     body: "This is my first blog post"
// });

// Blog.update({ _id: "59c1e22dfca6910fa9433661" }, { $set: { image: "https://source.unsplash.com/rxPqkK0hp3c/400x225" } }, function(err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("data updated!!");
//     }
// });

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
