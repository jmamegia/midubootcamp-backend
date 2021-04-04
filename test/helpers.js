const supertest = require("supertest");
const { app } = require("../index");
const api = supertest(app);
const User = require("../db/User");

const testUser = {
  userName: "jma",
  name: "jma",
  password: "password",
};

const user = {
  userName: "testUser",
  name: "test",
  password: "sasdasdasd",
};

const initialNotes = [
  {
    content: "note 1",
    important: true,
    userId: "605e07dedc2be480ad629718",
  },
  {
    content: "note 2",
    important: false,
    userId: "605e07dedc2be480ad629718",
  },
  {
    content: "note 3",
    important: false,
    userId: "605e07dedc2be480ad629718",
  },
];

const getAllUsers = async () => {
  const user = await User.find();
  return user;
};

module.exports = { initialNotes, api, getAllUsers, user, testUser };
