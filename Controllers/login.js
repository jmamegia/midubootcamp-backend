const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../db/User");
const jsonWebToken = require("jsonwebtoken");
const secret = process.env.SECRET;

loginRouter.post("/", async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });

  const correctPassword =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (correctPassword) {
    const userForToken = {
      id: user._id,
      userName: user.userName,
      name: user.name,
    };
    const token = jsonWebToken.sign(userForToken, secret, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    res.send({
      name: user.name,
      userName: userName,
      token,
    });
  } else res.status(401).json({ error: "invalid credentials" });
});

module.exports = loginRouter;
