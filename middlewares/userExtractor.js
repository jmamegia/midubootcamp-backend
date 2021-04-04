const jsonWebToken = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    const token = authorization.split(" ")[1].replace(/['"]+/g, "");
    const decodedToken = jsonWebToken.decode(token, process.env.SECRET);
    if (!decodedToken) {
      res.status(401).json({ error: "token invalid or missing" });
    }
    req.userId = decodedToken.id;
  }
  next();
};
