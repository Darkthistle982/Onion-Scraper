const mongoose = require("mongoose");
const Comments = require("./Comments")

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]

});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;