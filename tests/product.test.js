const request = require("supertest");
const app = require("../app");
const sequelize = require("../models");
const { models } = sequelize;
const { beforeAll, beforeEach } = require("@jest/globals");

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
    // delete all products
    await models.Product.destroy({
      where: {},
      truncate: true,
    });
    console.log("delete all products & users successfully");
    done();
  } catch (error) {
    console.log(error);
  }
});

afterAll(() => {
  // Closing the DB connection allows Jest to exit successfully.
  sequelize.close();
});

// test get all products endpoint.
describe("Get /api/v1/products", () => {
  it("should return all products", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "user1@g.com",
      password: "123456789",
      name: "ahmad",
      role: "user",
    });

    const res = await request(app)
      .get("/api/v1/products")
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("products");
    expect(res.body.products).toHaveProperty("rows");
    expect(res.body.products).toHaveProperty("count");
  });

  it("should return unauthorized", async () => {
    const res = await request(app).get("/api/v1/products").send();
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
  });
});

// test create product endpoint.
describe("Post /api/v1/products", () => {
  it("should create product user role admin", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "admin1@g.com",
      password: "123456789",
      name: "ahmad",
      role: "admin",
    });

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({
        title: "p1",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("product");
  });
  it("should create product user role super_admin", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "superAdmin@g.com",
      password: "123456789",
      name: "ahmad",
      role: "super_admin",
    });

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({
        title: "p1",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("product");
  });
  it("should not create product user role user", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "user43265@g.com",
      password: "123456789",
      name: "ahmad",
      role: "user",
    });

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({
        title: "p1",
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("error");
  });
  it("should not create product body is empty", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "hjgkjlhjlkg@g.com",
      password: "123456789",
      name: "ahmad",
      role: "admin",
    });

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should not create product body no token ", async () => {
    const res = await request(app).post("/api/v1/products").send({});
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
  });
});

// test get product endpoint.
describe("Get /api/v1/products/:id", () => {
  it("should get product", async () => {
    const p = await models.Product.create({
      title: "title",
    });
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "jhgjkhk@g.com",
      password: "123456789",
      name: "ahmad",
      role: "user",
    });

    const res = await request(app)
      .get(`/api/v1/products/${p.id}`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("product");
  });
  it("should return product not found", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "hjgkjhkljl@g.com",
      password: "123456789",
      name: "ahmad",
      role: "user",
    });

    const res = await request(app)
      .get(`/api/v1/products/hjgkhkjklhjfk`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send();
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
  it("should return unauthorized", async () => {
    const res = await request(app).get(`/api/v1/products/hjgkhkjklhjfk`).send();
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
  });
});

// test update product endpoint.
describe("Put /api/v1/products", () => {
  it("should update product user role admin", async () => {
    const p = await models.Product.create({
      title: "title",
    });
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "hjghkhjhj@g.com",
      password: "123456789",
      name: "ahmad",
      role: "admin",
    });

    const res = await request(app)
      .put(`/api/v1/products/${p.id}`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({
        title: "updated one",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("product");
  });
  it("should update product user role super_admin", async () => {
    const p = await models.Product.create({
      title: "title",
    });
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "dttrdfughj@g.com",
      password: "123456789",
      name: "ahmad",
      role: "super_admin",
    });

    const res = await request(app)
      .put(`/api/v1/products/${p.id}`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({
        title: "updated one",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("product");
  });
  it("should not update product user role user", async () => {
    const p = await models.Product.create({
      title: "title",
    });
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "dfdfty@g.com",
      password: "123456789",
      name: "ahmad",
      role: "user",
    });

    const res = await request(app)
      .put(`/api/v1/products/${p.id}`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({
        title: "updated one",
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("error");
  });
  it("should return bad request body empty.", async () => {
    const p = await models.Product.create({
      title: "title",
    });
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "hjjklgkl@g.com",
      password: "123456789",
      name: "ahmad",
      role: "admin",
    });

    const res = await request(app)
      .put(`/api/v1/products/${p.id}`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send();
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should return unauthorized.", async () => {
    const p = await models.Product.create({
      title: "title",
    });

    const res = await request(app).put(`/api/v1/products/${p.id}`).send();
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
  });
  it("should return not found.", async () => {
    const userData = await request(app).post("/api/v1/auth/register").send({
      email: "yughjjkhjgfj@g.com",
      password: "123456789",
      name: "ahmad",
      role: "admin",
    });

    const res = await request(app)
      .put(`/api/v1/products/ttyyk`)
      .set("Authorization", `Bearer ${userData.body.accessToken}`)
      .send({ title: " jk" });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
});
