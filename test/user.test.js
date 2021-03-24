const User = require("../db/User");
const bcrypt = require("bcrypt");
const { api } = require("./helpers");
const { server } = require("../index");

describe("createn a new user", () => {
  beforeEach(async () => {
    const passwordHash = await bcrypt.hash("password", 10);
    await User.deleteMany({});
    const user = new User({
      userName: "jma",
      name: "jma",
      passwordHash: passwordHash,
    });
    await user.save();
  });

  test("new user is created ok", async () => {
    const usersDb = await User.find();
    const usersBefore = usersDb.map((user) => user.toJSON());
    const user = {
      userName: "testUser",
      name: "test",
      password: "sasdasdasd",
    };
    await api
      .post("/api/user")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await User.find({});
    const usersAfterJson = usersAfter.map((user) => user.toJSON());

    expect(usersAfterJson).toHaveLength(usersBefore.length + 1);
    const usernames = usersAfterJson.map((name) => name.userName);
    expect(usernames).toContain(user.userName);
  });

  afterAll(async () => {
    server.close();
    mongoose.connection.close();
  });
});
