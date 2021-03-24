const notesRouter = require("express").Router();
const Note = require("../db/Notes");

notesRouter.get("/", (req, res) => {
  Note.find().then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end();
    })
    .catch((err) => {
      next(err);
    });
});

notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((deleted) => {
      res.status(204).json(deleted);
    })
    .catch((err) => {
      console.log(err);
    });
});

notesRouter.put("/:id", () => {
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

notesRouter.post("/", (req, res) => {
  if (req.body && req.body.content) {
    const note = new Note({
      content: req.body.content,
      date: new Date(),
      important: req.body.important || false,
    });
    note
      .save()
      .then((note) => res.status(201).json(note))
      .catch(() => res.status(401).json({ error: "Db error" }));
  } else res.status(400).json({ error: "void fields" });
});

module.exports = notesRouter;
