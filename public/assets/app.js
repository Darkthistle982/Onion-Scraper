$(document).ready(function () {
//event to tie and run the scrape route upon click of the scrape new articles button//
  $(document).on("click", "#scrape", function (request, response) {
    $.ajax({
      method: "GET",
      url: "/scrape/",
    })
      .then(function (result) {
        window.location.reload();
      })
      .catch(function (error) {
        throw error;
      });
  });

// event to handle the button click and route call for the clear button//
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

//event to handle the save comment on the modal//
 $(document).on("click", "#saveComment", function(request, response) {
     let thisID = $(this).attr("data-id");
     console.log(thisID);
     $.ajax({
         method: "POST",
         url: "/articles/" + thisID,
         data: {
             body: $("#commentsForm" + thisID).val(),
         }
     })
     .then(function (result) {
         console.log(result);
         $("#commentsForm" + thisID).val("");
     })
     .catch(function (error) {
         throw error;
     });
 });

//logic and event to activate the scroll to top button//
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
