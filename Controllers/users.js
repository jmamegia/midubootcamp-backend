const usersRouter = require("express").Router();
const User = require("../db/User");
const bcrypt = require("bcrypt");

usersRouter.post("/", async (req, res) => {
  const { body } = req;
  const { userName, name, password } = body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ userName, name, passwordHash });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
