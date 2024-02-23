const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // Invalid or expired token
        return res.status(401).json({ message: "token invalid" });
      } else {
        // Valid token, set the decoded token on the request object for later use
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    // Missing token
    return res.status(401).json({ message: "token required" });
  }
};