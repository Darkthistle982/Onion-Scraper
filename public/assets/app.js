$(document).ready(function () {
  $(document).on("click", "#scrape", function (request, response) {
    // console.log("Scrape Started")
    $.ajax({
      method: "GET",
      url: "/scrape/",
    })
      .then(function (result) {
        // console.log("Scrape Completed, Redirecting.")
        window.location.reload();
      })
      .catch(function (error) {
        throw error;
      });
  });

  $(document).on("click", "#clear", function (request, response) {
    $.ajax({
      method: "POST",
      url: "/clear/",
    })
      .then(function (result) {
        console.log(result);
        window.location = "/";
      })
      .catch(function (error) {
        throw error;
      });
  });

 $(document).on("click", "#saveComment", function() {
     let thisID = $(this).attr("data-id");
     $.ajax({
         method: "POST",
         url: "/articles/" + thisID,
         data: {
             body: $("#commentsForm").val(),
         }
     })
     .then(function (result) {
         console.log(result);
         $("#commentsForm").empty();
     })
     .catch(function (error) {
         throw error;
     });
 });

  $(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
      $("#back2Top").fadeIn();
    } else {
      $("#back2Top").fadeOut();
    }
  });
  $(document).ready(function() {
    $("#back2Top").click(function(event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });
  });
});
