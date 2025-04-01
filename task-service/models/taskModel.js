const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  priorite: { type: String, required: true },
  status: {
    type: String,
    enum: ["a faire,", "en cours", "termine"],
    default: "todo",
  },
  deadline: { type: String, required: true },
  comment: [{ type: String, ref: "comment" }],
  assignment: { type: String, ref: "User" },
});

module.exports = mongoose.model("task", taskSchema);
