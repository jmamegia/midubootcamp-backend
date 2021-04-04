const mongoose = require("mongoose");
const Note = require("../db/Note");
const { server } = require("../index");
const { initialNotes, api } = require("./helpers");

beforeEach(async () => {
  await Note.deleteMany();
  const note1 = new Note(initialNotes[0]);
  await note1.save();
  const note2 = new Note(initialNotes[1]);
  await note2.save();
  const note3 = new Note(initialNotes[3]);
  await note3.save();
});

test("void post not added", async () => {
  const initialResponse = await api.get("/api/notes");
  const initialLength = initialResponse.body.length;
  await api.post("/api/notes").send({}).expect(400);

  const response = await (await api.get("/api/notes")).body;
  expect(response).toHaveLength(initialLength);
});

test("post test", async () => {
  const newNote = {
    content: "note posted",
  };
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/notes");
  const contens = response.body.map((note) => note.content);
  expect(contens).toContain("note posted");
});
test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are correct number of notes", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

test("firts result is note 1", async () => {
  const response = await api.get("/api/notes");
  expect(response.body[0].content).toBe("note 1");
});
test("the is a note 2", async () => {
  const response = await api.get("/api/notes");
  const contens = response.body.map((note) => note.content);
  expect(contens).toContain("note 2");
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
