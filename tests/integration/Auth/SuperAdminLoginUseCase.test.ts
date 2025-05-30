import request from "supertest";
import app from "../../../src/app";
import { SuperadminModel } from "../../../src/infrastructure/db/models/SuperadminModel";
import bcrypt from "bcrypt";

describe("POST /api/auth/super-admin/login", () => {
  const endpoint = "/api/auth/super-admin/login";

  beforeAll(async () => {
    await SuperadminModel.destroy({ where: {}, force: true });

    const password = await bcrypt.hash("originalPassword", 10);
    const superadmin = await SuperadminModel.create({
      name: "Original Superadmin",
      email: "original@superadmin.com",
      password,
      role: "superadmin",
    });
    await superadmin.save();
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@superadmin.com",
      password: "originalPassword",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data).toHaveProperty("token");
  });

  it("should fail login with invalid email", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@superadminfail.com",
      password: "originalPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email not found");
  });

  it("should fail login with invalid password", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@superadmin.com",
      password: "wrongPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should fail login with empty email", async () => {
    const res = await request(app).post(endpoint).send({
      email: "",
      password: "originalPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email not found");
  });

  it("should fail login with empty password", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@superadmin.com",
      password: "",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  afterAll(async () => {
    await SuperadminModel.destroy({ where: {}, force: true });
  });
});
