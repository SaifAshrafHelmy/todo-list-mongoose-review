const mongoose = require("mongoose");
const taskSchema = require("./task");
const { Schema } = mongoose;


const userSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], maxLength:25,  index: true },

  // S capital == negated version of s === so, non-white space characters
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'],  maxLength:254, index: true },


  hash: String,

}, { timestamps: true })



const User = mongoose.model("User", userSchema);


module.exports = User;