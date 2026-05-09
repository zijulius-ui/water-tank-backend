const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    tankId: String
});

module.exports = mongoose.model("User", userSchema);