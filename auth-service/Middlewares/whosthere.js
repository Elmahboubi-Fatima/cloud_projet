//Checks if the current user's role is granted access to the route

const whosthere = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" })
    }
    next()
  }
  
module.exports = whosthere


  