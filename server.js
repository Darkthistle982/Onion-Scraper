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

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/onionScraper";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Routes//
//main route to render the main page.//
app.get("/", function (request, response) {
  db.Article.find({})
    .lean()
    .then(function (result) {
      // console.log(result);
      let articleObj = { article: result };
      response.render("index", articleObj);
    })
    .catch(function (error) {
      response.status(418).send(error.message);
    });
});

//route to save/update a comment to an article//
app.post("/articles/:id", function (request, response) {
  db.Comment.create(request.body)
    .then(function (createdComment) {
      return db.Article.findOne(
        { _id: request.params.id },
        { $set: { comment: createdComment._id } },
        { new: true }
      );
    })
    .then(function (modifiedArticle) {
      response.json(modifiedArticle);
    })
    .catch(function (error) {
      response.status(404).send(error.message);
    });
});

//route to clear the current articles from the db
app.post("/clear", function (request, response) {
  db.Article.deleteMany({}).lean()
    .then(function (result) {
      response.json(result);
    })
    .catch(function (error) {
      throw error;
    });
});

//route to run a scrape of current articles from theonion.com and place them in the database.//
app.get("/scrape", function (request, response) {
  axios.get("https://www.theonion.com/").then(function (responseData) {
    let $ = cheerio.load(responseData.data);

    db.Article.deleteMany({}).then(function () {
      $("article").each(function (i, element) {
        let scrapedArticle = {};
        scrapedArticle.title = $(element).find("h4").first().text();
        scrapedArticle.summary = $(element).find("p").first().text();
        scrapedArticle.link = $(element).find("a:nth-child(2)").attr("href");
        if (typeof scrapedArticle.link === "undefined") {
          return;
        }
        db.Article.create(scrapedArticle)
          .then(function (dbArticle) {
            if (!response.headersSent) {
              response.json(dbArticle);
            }
            // console.log(dbArticle);
          })
          .catch(function (error) {
            if (!response.headersSent) {
              response.status(404);
            }
            console.log(error);
          });
      });
    });
    console.log("Scrape Successful");
  });
});

//Listener to Start the Server//
app.listen(PORT, function () {
  console.log("app running on port " + PORT);
});
