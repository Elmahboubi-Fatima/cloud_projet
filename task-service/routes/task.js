const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");
const verifyToken = require("../middleware");
const axios = require("axios");
const Comment = require("../models/commentModel");

router.get("/all", verifyToken, async (req, res) => {
  try {
    const task = await Task.find();
    res.status(200).json({ task });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/add", async (req, res) => {
  const addTask = new Task(req.body);
  try {
    const saveTask = await addTask.save();
    res.status(200).json({ saveTask });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const updateTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updateTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/assign/:user_id/:task_id", async (req, res) => {
  try {
    const { user_id, task_id } = req.params;

    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userResponse = await axios.get(
      `http://localhost:3000/users/${user_id}`
    );
    const user = userResponse.data;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    task.userTask = user_id;
    await task.save();

    res.json({ message: "Task assigned successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/addComment/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const comment = new Comment({ text, task_id });
    const saveComment = await comment.save();

    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.comment.push(comment._id);
    await task.save();

    res
      .status(200)
      .json({ message: "u have commented successfully", saveComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
