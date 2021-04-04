const notesRouter = require("express").Router();
const userExtractor = require("../middlewares/userExtractor");
const Note = require("../db/Note");
const User = require("../db/User");

notesRouter.get("/", (req, res) => {
  Note.find()
    .populate("users", { userNAme: 1, name: 1 })
    .then((notes) => {
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

notesRouter.delete("/:id", userExtractor, (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((deleted) => {
      res.status(204).json(deleted);
    })
    .catch((err) => {
      console.log(err);
    });
});

notesRouter.put("/:id", userExtractor, (req, res, next) => {
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

notesRouter.post("/", userExtractor, async (req, res, next) => {
  if (req.body && req.body.content) {
    const note = new Note({
      content: req.body.content,
      date: new Date(),
      important: req.body.important || false,
      userId: req.userId,
    });

    try {
      await note.save();
      const user = await User.findById(note.userId);

      user.notes = [...user.notes, note.userId];
      await user.save();
      res.status(201).json({ note });
    } catch (error) {
      res.status(401).json({ errorName: "Db error", error });
    }
  } else res.status(400).json({ error: "void fields" });
});

module.exports = notesRouter;
