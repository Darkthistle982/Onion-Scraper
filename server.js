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

let MONGODB_URI =
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
    .populate("Comments")
    .then(function (result) {
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
      return db.Article.findOneAndUpdate(
        { _id: request.params.id },
        { comments: createdComment._id },
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
  db.Article.deleteMany({})
    .lean()
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

//route to display the saved articles//
app.get("/saved", function (request, response) {
  db.Article.find({ saved: true })
    .lean()
    .populate("comments")
    .then(function (result) {
      let articleObject = { article: result };
      response.render("saved", articleObject);
    })
    .catch(function (error) {
      response.status(418).send(error.message);
    });
});

//route to delete a specific article from "saved Articles" and put them back on the main page//
app.post("/delete/:id", function (request, response) {
  db.Article.findOneAndUpdate(
    { _id: request.params.id },
    { $set: { saved: false } }
  )
    .lean()
    .then(function (result) {
      response.json(result);
    })
    .catch(function (error) {
      response.status(404).send(error.message);
    });
});

//route to delete a note from a saved article//
app.post("/deleteNote/:id", function (request, response) {
  db.Comment.deleteOne({ _id: request.params.id })
  .lean()  
  .then(function (result) {
      response.json(result);
    })
    .catch(function (error) {
      response.status(402).send(error.message);
    });
});

//route to save an article//
app.post("/saved/:id", function (request, response) {
  db.Article.findOneAndUpdate(
    { _id: request.params.id },
    { $set: { saved: true } }
  )
    .then(function (result) {
      response.json(result);
    })
    .catch(function (error) {
      response.json(error);
    });
});

//Listener to Start the Server//
app.listen(PORT, function () {
  console.log("app running on port " + PORT);
});
