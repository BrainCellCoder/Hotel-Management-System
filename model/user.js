const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Username cannot be blank"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "Passowrd cannot be blank"]
    },
    firstName: String,
    lastName: String,
    phone: Number,
    email: String,
    address: String,
    booked:[
        {
            name:String,
            location: String,
            image: String,
            price: Number,
            enter: String,
            exit: String,
            guest: Number
        }
    ]
});

module.exports = mongoose.model("User", userSchema);