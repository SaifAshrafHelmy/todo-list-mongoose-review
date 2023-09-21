const mongoose = require("mongoose")
const { Schema } = mongoose;

const taskSchema = new Schema({
  content: String,
  done: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }

})



const Task = mongoose.model("Task", taskSchema);


module.exports = Task;