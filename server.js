const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const Handlebars = require("express-handlebars");
const db = require("./models");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/onionScraper", { useNewUrlParser: true });

//Routes//
app.get("/", function (request, response) {
  db.Article.find({}).lean()
    .then(function (result) {
      console.log(result);
      let articleObj = { article: result };
      return response.render("index", articleObj);
    })
    .catch(function (error) {
      response.status(418).send(error.message);
    });
});

//route to run a scrape of current articles from theonion.com and place them in the database.
app.get("/scrape", function (request, response) {
  axios.get("https://www.theonion.com/").then(function (response) {
    let $ = cheerio.load(response.data);

    db.Article.remove({}).then(function () {
      $("article").each(function (i, element) {
        let scrapedArticle = {};
        scrapedArticle.title = $(element).find("h4").first().text();
        scrapedArticle.summary = $(element).find("p").first().text();
        scrapedArticle.link = $(element).find("a:nth-child(1)").attr("href");

        db.Article.create(scrapedArticle)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    });
  });
  response.send("Scrape Successful");
});

//Listener to Start the Server//
app.listen(PORT, function () {
  console.log("app running on port " + PORT);
});
