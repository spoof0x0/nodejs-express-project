const mongoose = require("mongoose")

const schema = mongoose.Schema

const userschema = new schema({
    name: String,
    email: String,
    age: Number
})

const user = mongoose.model("user", userschema)

module.exports = user