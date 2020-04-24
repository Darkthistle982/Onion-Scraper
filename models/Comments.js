const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let CommentSchema = new Schema({
  body: {
    type: String,
  },
  article: {
      type: Schema.Types.ObjectId,
      ref: "Article"
  }
});

let Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
