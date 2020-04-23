const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const handlebars = require("express-handlebars");
const db = require("./models");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("views"));

mongoose.connect("mongodb://localhost/onionScraper", { useNewUrlParser: true });

//Routes//




//Listener to Start the Server//
app.listen(PORT, function() {
    console.log("app running on port " + PORT);
});