const mongoose = require("mongoose");

// without custom validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  createdDate : {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, versionKey: false});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
