const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    username: String,
    ratings: Number,
    body: String
});

module.exports = mongoose.model("Review", reviewSchema);