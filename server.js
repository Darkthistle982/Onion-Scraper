const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const handlebars = require("express-handlebars");
const db = require("./models");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("/views"));

mongoose.connect("mongodb://localhost/onionScraper", { useNewUrlParser: true } );

//Routes//
app.get("/", function(request, response) {
    response.render("index");
});


app.get("/scrape", function(request, response) {
    axios.get("https://www.theonion.com/")
    .then(function(response) {
        let $ = cheerio.load(response.data);

        $("article").each(function(i, element) {
            let scrapedArticle = {};
            scrapedArticle.title = $(this).children("h4").text();
            scrapedArticle.summary = $(this).children("p").text();
            scrapedArticle.link = $(this).children("a").attr("href");
            
            db.Article.create(scrapedArticle)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(error) {
               console.log(error);
            })
        })
    })
    response.send("Scrape Completed")
})



//Listener to Start the Server//
app.listen(PORT, function() {
    console.log("app running on port " + PORT);
});