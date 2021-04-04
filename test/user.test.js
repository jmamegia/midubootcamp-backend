const User = require("../db/User");
const { api, getAllUsers, user, testUser } = require("./helpers");
const { server } = require("../index");
const bcrypt = require("bcrypt");

describe("createn a new user", () => {
  beforeEach(async () => {
    const passwordHash = await bcrypt.hash("password", 10);
    testUser.passwordHash = passwordHash;
    const newUser = new User(testUser);
    await User.deleteMany({});
    await newUser.save();
  });

  test("new user is created ok", async () => {
    const usersDb = await getAllUsers();
    const usersBefore = usersDb.map((user) => user.toJSON());

    await api
      .post("/api/user")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await getAllUsers();
    const usersAfterJson = usersAfter.map((user) => user.toJSON());

    expect(usersAfterJson).toHaveLength(usersBefore.length + 1);
    const usernames = usersAfterJson.map((name) => name.userName);
    expect(usernames).toContain(user.userName);
  });

  test("fail creating new user if username exist and return status code", async () => {
    const users = await getAllUsers();
    await api
      .post("/api/user")
      .send(testUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await getAllUsers();
    expect(users).toHaveLength(usersAfter.length);
  });

  test("users returned by db are equals users returned by api", async () => {
    const dbUserNames = await (await getAllUsers()).map(
      (user) => user.userName
    );
    const apiUsers = await api
      .get("/api/user")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const apiUserNames = apiUsers.body.map((user) => user.userName);
    expect(apiUserNames).toMatchObject(dbUserNames);
  });

  afterAll(async () => {
    server.close();
    mongoose.connection.close();
  });
});
