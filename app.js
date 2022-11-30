const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles").get(function(req, res){
  Article.find(function(err, foundArticle){
    if (!err) {
      res.send(foundArticle);
    } else {
      console.log(err);
    }
  })
}).post(function(req, res){
  //create a new article document
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err) {
      res.send("post succeed");
    } else {
      res.send(err);
    }
  })
}).delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Sucessfully delete all the articles");
    } else {
      res.send(err);
    }
  })
});

// targeting specific articles
app.route("/articles/:articleTitle").get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (!err) {
      res.send(foundArticle);
    } else {
      console.log(err);
    }
  })
}).put( (req, res) => {
  console.log(req.body);
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (!err) {
      foundArticle.title = req.body.title;
      foundArticle.content = req.body.content;
      foundArticle.save(function(err){
        if (!err) {
          res.send("Succeed");
        } else {
          res.send(err);
        }
      });
    } else {
      console.log(err);
    }
  })
  // Article.updateOne(
  //   {title: req.params.articleTitle},                             // Condition
  //   {$set: {title: req.body.title, content: req.body.content}},   // New data
  //   {overwrite: true},                                            // Overwrite with new data
  //   (err) => {
  //     if(!err) {
  //       res.send("Successfully updated article.");
  //     } else {
  //       console.log(article);
  //       res.send(err);
  //     }
  //   }
  // );
})
.patch(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if (!err) {
        res.send("Succeed");
      } else {
        res.send(err);
      }
    }
  )
}).delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("Sucessfully delete");
      } else {
        res.send(err);
      }
    }
  )
});
