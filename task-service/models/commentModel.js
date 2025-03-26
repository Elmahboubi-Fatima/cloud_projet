const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  task_id: [{ type: String, ref: "task" }],
  text: { type: String, required: true },
});

module.exports = mongoose.model("comment", commentSchema);
