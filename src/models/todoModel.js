const mongoose = require("mongoose");

// without custom validation
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
    },
    status: {
      type: String,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

const todoModel = mongoose.model("todos", todoSchema);
module.exports = todoModel;