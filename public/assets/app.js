$(document).ready(function() {
    $(document).on("click", ".scrape-new", function(request, response) {
        console.log
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(function(result) {
            response.send("data scraped");
            response.redirect("/");
        })
        .catch(function(error) {
            throw error;
        })
    });
});

// $(document).ready(function(){
//     console.log("Hello there");
//     $.ajax({
//         method: "GET",
//         url: "/scrape/"
//     })
//     .then(function(data){
//         console.log("Articles Scraped and inserted to DB");
//         data.send("Data Scraped")

//     })
//     .catch(function(error) {
//      throw error;
//     });
// });