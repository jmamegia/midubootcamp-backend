const supertest = require("supertest");
const { app } = require("../index");
const api = supertest(app);

const initialNotes = [
  {
    content: "note 1",
    important: true,
  },
  {
    content: "note 2",
    important: false,
  },
  {
    content: "note 3",
    important: false,
  },
];

module.exports = { initialNotes, api };
