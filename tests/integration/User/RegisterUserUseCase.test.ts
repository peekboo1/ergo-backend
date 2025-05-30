import request from "supertest";
import app from "../../../src/app";
import sequelize from "../../../src/config/database";

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/personal/register", () => {
  it("should successfully register a new user", async () => {
    const res = await request(app).post("/api/personal/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should return error if email already exists (in use)", async () => {
    await request(app).post("/api/personal/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User 1",
    });

    const res = await request(app).post("/api/personal/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User 2",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/email already in use/i);
  });

  it("should return validation error if fields are missing", async () => {
    const res = await request(app).post("/api/personal/register").send({
      email: "incomplete@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/missing/i);
  });

  it("should return validation error if email format is invalid", async () => {
    const res = await request(app).post("/api/personal/register").send({
      email: "invalid-email-format",
      password: "password123",
      name: "User With Invalid Email",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("should return validation error if name is missing", async () => {
    const res = await request(app).post("/api/personal/register").send({
      email: "no-name@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/missing/i);
  });

  it("should return validation error if password is missing", async () => {
    const res = await request(app).post("/api/personal/register").send({
      email: "nopassword@example.com",
      name: "No Password",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/missing/i);
  });

  it("should return validation error if email is missing", async () => {
    const res = await request(app).post("/api/personal/register").send({
      password: "password123",
      name: "No Email",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/missing/i);
  });

  it("should trim input and still register successfully", async () => {
    const res = await request(app).post("/api/personal/register").send({
      name: "   Jane   ",
      email: "   janetrim@example.com  ",
      password: "   secret123   ",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User registered successfully");
  });
});
