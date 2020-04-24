console.log("is anyone there?")

$(document).ready(function(){
    console.log("Hello there");
    $.ajax({
        method: "GET",
        url: "/scrape/"
    })
    .then(function(data){
        console.log("Articles Scraped and inserted to DB");
    })
    .catch(function(error) {
     throw error;
    });
});