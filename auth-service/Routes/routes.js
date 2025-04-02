const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../Models/models")
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config() 
const whosthere = require("../Middlewares/whosthere")
const knockknock = require("../Middlewares/knockknock")

router.post("/register", async (req, res) => {
  const { email, name, role, password } = req.body
  if (!email || !name || !role || !password) {
    return res.status(400).json({ message: "Please verify your input fields" })
  }
  const inst = await User.findOne({ email })
  if (inst) {
    return res.status(400).json({ message: "This email is already used" })
  }
  const hpw = await bcrypt.hash(password, 10)
  const _id = role + "_" + email
  try {
    await User.create({ _id, email, name, password: hpw, role })
    res.status(201).json({ message: "User created successfully" })
  } catch (err) {
    res.status(501).json(err)
  }
}) 

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }
  const check = await bcrypt.compare(password, user.password)
  if (!check) {
    return res.status(400).json({ message: "Invalid Credentials" })
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
  res.json({ token })
})

router.put("/update", knockknock, async (req, res) => {
  const { name, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId) 
    if (!user) return res.status(404).json({ error: "User not found" })
    await User.findByIdAndUpdate(userId, {
      name: name,
      password: password ? await bcrypt.hash(password, 10) : user.password
    })
    res.json({ message: "Your informations have been updated"})
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})




router.delete("/delete/:id", knockknock, whosthere(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) return res.status(404).json({ error: "User not found" })

      await User.findByIdAndDelete(req.params.id)
      res.json({ message: "User deleted successfully" })
    } catch (error) {
      res.status(500).json({ error: "Server error" })
    }
  }
) 

router.get("/search", async (req, res) => {
  const { filter, value } = req.query
  if (!["name", "email", "role"].includes(filter)) {
    return res.status(400).json({ message: "Invalid search parameter" })
  }
  if (!value) {
    return res.status(400).json({ message: "Please fill the search value" })
  }
  let query = {}
  switch (filter) {
    case "name":
      query = { name: { $regex: value, $options: "i" } }
      break 
    case "email":
      query = { email: { $regex: value, $options: "i" } }
      break
    case "role":
       query = { role: { $regex: value, $options: "i" } }
      break
  }
  const users = await User.find(query).select("-password")
  if (users.length == 0) {
    return res.status(404).json({ message: "No users found" })
  }
  res.json(users) 
}) 

module.exports = router 
