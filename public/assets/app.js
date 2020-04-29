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

  //event to handle click and call to route to delete a note//
  $(".deleteNote").on("click", function() {
      let thisID = $(this).attr("data-note-id");
      $.ajax({
          method: "POST",
          url: "/deleteNote/" + thisID
      })
      .then(function(data) {
          console.log(data);
          window.location.reload();
      })
      .catch(function(error) {
          throw error;
      })
  })
  //event to handle the save comment on the modal//
  $(document).on("click", "#saveComment", function (request, response) {
    let thisID = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisID,
      data: {
        body: $("#commentsForm" + thisID).val(),
      },
    })
      .then(function (result) {
        $("#commentsForm" + thisID).val("");
        window.location.reload();
      })
      .catch(function (error) {
        throw error;
      });
  });

  //logic and event to activate the scroll to top button//
  $(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 100) {
      $("#back2Top").fadeIn();
    } else {
      $("#back2Top").fadeOut();
    }
  });
  $(document).ready(function () {
    $("#back2Top").click(function (event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });
  });

  //click function to delete from saved//
  $(".delete").on("click", function () {
    let thisID = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/delete/" + thisID,
    })
      .then(function (data) {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error.message);
      });
  });

  //on click and logic for the save button//
  $(".save").on("click", function () {
    let thisID = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saved/" + thisID,
    })
      .then(function (result) {
        window.location = "/";
      })
      .catch(function (error) {
        console.log(error.message);
      });
  });
});
