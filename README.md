# Onion-Scraper
A web app to scrape and view "news" stories

## Table of Conents

* Application use
* Tech Used
* Details of Application and Challenges
* Link to Live Project

## Application Use
The Onion-Scraper is a simple web-application that scrapes the popular parody news site, The Onion, for articles, and lets you view headlines and summaries on a splash page, then save articles to a site that you are interested in. You can view the saved artilces from a link to that page in the navigation bar. From that page, you can delete the article from saved, you can leave comments on articles, and delete comments on articles. 

## Tech Used

* HTML5
* Bootstrap
* Fontawesome.com
* Javascript
* Express
* Handlebars
* Node.js
* Google Fonts
* JQuery
* Heroku
* Axios
* MongoDB
* Mongoose
* Cheerio
* ESLint
* CSS
* MongoLab 

## Details of Application & Challenges

The main app works using two main items, Express-Handlebars to render the site, and Cheerio to scrape the content. We use a Node.js server, hosted by heroku, that scrapes The Onion for articles, and saves them to a MongoDB, run by Mongolab. There are options to scrape for new articles, which will update the site. You can also save individual articles from the home page, as well as click on any article to open it in a new browser window. 

In the nav-bar, you can click through to the saved articles page, which will only render the articles that have been saved. The saved page also has a comment feature, that allows and displays the current comment for each article, or a static message if none have been applied. You can also delete comments, as well as articles from the saved page. 

This was a particularly challenging assignment, as there were some major struggles with handlebars, due to the inability to use script tags in the main code. It meant there were some very specific versioning that had to be used for bootstrap, jquery and popper, and I had to fiddle with the layout of those tags in the main.hbs file a lot in order to get my bootstrap items to work. 

The modal function in particular was a challenge, as it was very particular on which version of jquery was installed, as the min versions that are standard in the bootstrap docs cdn do not contain axios, which is intgral to the logic running the site. 

I also struggled greatly with my rendering, as my data continuously returned invalid values. This ended up being a mongoose issue, as the returned data, was not standard json objects. I remedied this with the .lean method, which returned the data to a json format, and thusly allowed me to access the data as I needed it. 

I was not able to find a way to scrape articles, and only pull down new ones without duplicates, so I ended up including a deletemany first, to wipe the articles from the db, then scrape. This isn't ideal but it was the only way I could get the scrape working without a massive amount of duplicate articles appearing. 

### Link to the Live project: https://pacific-shelf-26881.herokuapp.com/