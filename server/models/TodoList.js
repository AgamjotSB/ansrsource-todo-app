const mongoose = require("mongoose");

const todoItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const todoListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [todoItemSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TodoList", todoListSchema);
