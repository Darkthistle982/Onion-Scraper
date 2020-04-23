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

app.use(express.static("/public"));

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
            scrapedArticle.title = $(element).find("h4").first().text();
            scrapedArticle.summary = $(element).find("p").first().text();
            scrapedArticle.link = $(element).find('a:nth-child(1)').attr("href");
            
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