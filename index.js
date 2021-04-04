/* eslint-disable eqeqeq */
const express = require("express");
const cors = require("cors");
require("./db/db.js");
const handleError = require("./middlewares/handleError.js");
const handle404 = require("./middlewares/handle404.js");
const usersRouter = require("./Controllers/users");
const notesRouter = require("./Controllers/notes");
const userLogin = require("./Controllers/login");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hi</h1>");
});

app.use("/api/notes", notesRouter);
app.use("/api/user", usersRouter);
app.use("/api/login", userLogin);
//app.use(handleError);
app.use(handle404);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => console.log(`Server on port : ${PORT}`));

module.exports = { app, server };
