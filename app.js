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

app.get("/articles", function(req, res){
  Article.find(function(err, foundArticle){
    if (!err) {
      res.send(foundArticle);
    } else {
      console.log(err);
    }
  })
})

app.post("/articles", function(req, res){
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
})

app.delete("/articles", function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Sucessfully delete all the articles");
    } else {
      res.send(err);
    }
  })
})
