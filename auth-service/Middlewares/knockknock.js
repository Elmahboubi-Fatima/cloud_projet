const jwt = require("jsonwebtoken");

const knockknock = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ message: "Invalid Session" })

  try {
    const payload = jwt.verify(token, 'secret')
    req.user = payload; 
    next()
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" })
  }
}

module.exports = knockknock;
