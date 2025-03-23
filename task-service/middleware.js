const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "Le token est obligatoire" });
  }
  try {
    const decrypt = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.userId = decrypt.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = verifyToken;
