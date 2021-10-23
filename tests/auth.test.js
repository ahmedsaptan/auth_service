const request = require("supertest");
const app = require("../app");
const sequelize = require("../models");
const { models } = sequelize;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { beforeAll } = require("@jest/globals");

beforeAll(async () => {
  try {
    // databases sync.
    await sequelize.sync({ alter: true, logging: false });

    console.log("sync to database successfully");
    // delete all users
    await models.User.destroy({
      where: {},
      truncate: true,
    });
    console.log("delete all users successfully");
    done();
  } catch (error) {
    console.log(error);
  }
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  sequelize.close();
  done();
});

// test register endpoint.
describe("Post /api/v1/auth/register", () => {
  it("should register user succssfully", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "ahme11d@g.com",
      password: "123456789",
      name: "ahmad",
      role: "user",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should return bad request no body", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request email is empty", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request email is not valid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "hjgkl",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request name not exist", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password not exist", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
      name: "ahmed",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password length less 8", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
      name: "ahmed",
      password: "4444",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password greather than 20", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
      name: "ahmed",
      password: "123456789123456789123456789",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request role not exist", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
      name: "ahmed",
      password: "123456789",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request role wrong value", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
      name: "ahmed",
      password: "123456789",
      role: "test",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should register user successfully", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@g.com",
      name: "ahmed",
      password: "123456789",
      role: "user",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});

// test login endpoint.
describe("Post /api/v1/auth/login", () => {
  it("should login user succssfully", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "ahmedlogin@g.com",
      password: "123456789",
      name: "ahmedlogin",
      role: "user",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "ahmedlogin@g.com",
      password: "123456789",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should return bad request no body", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request email is empty", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request email is not valid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "hjgkl",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password not exist", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@g.com",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password length less 8", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@g.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request password greather than 20", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@g.com",
      name: "ahmed",
      password: "123456789123456789123456789",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request email not exist", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "notexist@g.com",
      password: "123456789",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request wrong password", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "testlogin@g.com",
      password: "123456789",
      name: "ahmedlogin",
      role: "user",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testlogin@g.com",
      password: "12345446789",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
  it("should register user successfully", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "testlogin1@g.com",
      password: "123456789",
      name: "ahmedlogin",
      role: "user",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testlogin1@g.com",
      password: "123456789",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});

// test refresh token endpoint.
describe("Post /api/v1/auth/login", () => {
  it("should login user succssfully", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "ahmedlogin@g.com",
      password: "123456789",
      name: "ahmedlogin",
      role: "user",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "ahmedlogin@g.com",
      password: "123456789",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should return bad request no body", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request email is empty", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request email is not valid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "hjgkl",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password not exist", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@g.com",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request password length less 8", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@g.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request password greather than 20", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@g.com",
      name: "ahmed",
      password: "123456789123456789123456789",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request email not exist", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "notexist@g.com",
      password: "123456789",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return bad request wrong password", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "testlogin@g.com",
      password: "123456789",
      name: "ahmedlogin",
      role: "user",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testlogin@g.com",
      password: "12345446789",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
  it("should register user successfully", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "testlogin1@g.com",
      password: "123456789",
      name: "ahmedlogin",
      role: "user",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testlogin1@g.com",
      password: "123456789",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});
