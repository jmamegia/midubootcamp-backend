/* eslint-disable eqeqeq */
const express = require("express");
const cors = require("cors");
require("./db/db.js");
const Note = require("./db/Notes");
const { response } = require("express");
const handleError = require("./middlewares/handleError.js");
const handle404 = require("./middlewares/handle404.js");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hi</h1>");
});

// api
app.get("/api/notes", (req, res) => {
  Note.find().then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((deleted) => {
      res.status(204).json(deleted);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/api/notes/:id", () => {
  Note.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content, important: req.body.important },
    { new: true }
  )
    .then((updated) => {
      updated ? res.status(200).json(updated) : res.status(404).end();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/notes", (req, res) => {
  const note = new Note({
    content: req.body.content,
    date: new Date(),
    important: req.body.important || false,
  });
  note
    .save()
    .then((note) => res.status(201).json(note))
    .catch((err) => res.status(401).json({ error: "Db error" }));
});

app.use(handleError);

app.use(handle404);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port : ${PORT}`));
