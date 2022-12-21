const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name:String,
    location: String,
    image: String,
    price: Number,
    category: String,
    description: String,
    reviews: [
        {   
            username: String,
            ratings: Number,
            body: String
        }
    ]
});

module.exports = mongoose.model("Room", roomSchema);