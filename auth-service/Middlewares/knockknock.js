const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config() 
const knockknock = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ message: "Invalid Session" })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload; 
    next()
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" })
  }
}

module.exports = knockknock;
