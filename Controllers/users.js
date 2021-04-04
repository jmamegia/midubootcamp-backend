const usersRouter = require("express").Router();
const User = require("../db/User");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (req, res) => {
  const users = await User.find().populate("notes", {
    content: 1,
    date: 1,
    important: 1,
  });
  res.json(users);
});
usersRouter.post("/", async (req, res) => {
  const { body } = req;
  const { userName, name, password } = body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ userName, name, passwordHash });
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (e) {
    res.status(400).json({ error: "User name already exists" });
  }
});

module.exports = usersRouter;
