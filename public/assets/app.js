$(document).ready(function() {
    $(document).on("click", "#scrape", function(request, response) {
        // console.log("Scrape Started")
        $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        .then(function(result) {
            // console.log("Scrape Completed, Redirecting.")
            window.location.reload();
        })
        .catch(function(error) {
            throw error;
        })
    });

    $(document).on("click", "#clear", function(request, response) {
        $.ajax({
            method: "DELETE",
            url: "/clear/"
        })
        .then(function(result) {
            window.location.reload();
        })
        .catch(function(error) {
            throw error;
        })
    })


});
