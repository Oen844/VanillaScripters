const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  
  const token = req.headers["x-access-token"] || req.cookies.token;

  if (!token) {
    console.log('no token');
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.redirect('/login');
  }
  return next();
};

module.exports = verifyToken;