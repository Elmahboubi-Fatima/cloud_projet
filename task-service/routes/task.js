const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");
const axios = require("axios");
const Comment = require("../models/commentModel");
const whosthere = require("../Middlewares/whosthere");
const knockknock = require("../Middlewares/knockknock");

router.get("/all", async (req, res) => {
  try {
    const task = await Task.find();
    res.status(200).json({ task });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post(
  "/add",
  knockknock,
  whosthere(["admin", "member"]),
  async (req, res) => {
    const addTask = new Task(req.body);
    try {
      const saveTask = await addTask.save();
      res.status(200).json({ saveTask });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.put(
  "/update/:id",
  knockknock,
  whosthere(["admin", "member"]),
  async (req, res) => {
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
  }
);

router.delete(
  "/delete/:id",
  knockknock,
  whosthere(["admin"]),
  async (req, res) => {
    try {
      await Task.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "Task deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.post(
  "/assign/:task_id/:user_email",
  knockknock,
  whosthere(["admin", "member"]),
  async (req, res) => {
    try {
      const { task_id, user_email } = req.params;
      const task = await Task.findById(task_id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.assignment = user_email;
      await task.save();

      res.json({ message: "Task assigned successfully", task });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get("/status/:task_id", knockknock, async (req, res) => {
  try {
    const { task_id } = req.params;

    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ status: task.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/addComment/:task_id",
  knockknock,
  whosthere(["admin", "member"]),
  async (req, res) => {
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
  }
);

module.exports = router;
