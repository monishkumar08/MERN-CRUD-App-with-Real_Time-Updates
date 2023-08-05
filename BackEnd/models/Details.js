const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
  description: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("items", UserSchema);
module.exports = UserModel;
