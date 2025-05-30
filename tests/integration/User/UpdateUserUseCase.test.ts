import request from "supertest";
import app from "../../../src/app";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserModel } from "../../../src/infrastructure/db/models/UserModels";
const JWT_SECRET = "your-secret-key";

describe("PUT /api/personal/:id", () => {
  let userId: string;
  let token: string;

  beforeAll(async () => {
    await UserModel.destroy({ where: {} });

    const hashedPassword = await bcrypt.hash("initialPassword", 10);

    const user = await UserModel.create({
      name: "Initial User",
      email: "initialuser@example.com",
      password: hashedPassword,
      role: "personal",
    });

    userId = user.id;
    token = jwt.sign({ userId, role: "personal" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  it("should update user successfully when authenticated", async () => {
    const res = await request(app)
      .put(`/api/personal/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated User",
        email: "updateduser@example.com",
        password: "newpassword123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User updated successfully");
    expect(res.body.data.name).toBe("Updated User");
    expect(res.body.data.email).toBe("updateduser@example.com");
  });

  it("should return 400 if email already exists", async () => {
    await UserModel.create({
      name: "Conflict User",
      email: "conflict@example.com",
      password: await bcrypt.hash("pass", 10),
      role: "personal",
    });

    const res = await request(app)
      .put(`/api/personal/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Trying Conflict",
        email: "conflict@example.com",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already in use");
  });

  it("should return 403 if trying to update another user's data", async () => {
    const otherUser = await UserModel.create({
      name: "Other User",
      email: "other@example.com",
      password: await bcrypt.hash("pass", 10),
      role: "personal",
    });

    const res = await request(app)
      .put(`/api/personal/${otherUser.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Hacker",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Permission denied/i);
  });

  it("should allow superadmin to update any user", async () => {
    const superadminToken = jwt.sign(
      {
        userId: "superadmin-id",
        role: "superadmin",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .put(`/api/personal/${userId}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send({
        name: "Superadmin Edit",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Superadmin Edit");
  });

  it("should return 403 if no token provided", async () => {
    const res = await request(app).put(`/api/personal/${userId}`).send({
      name: "Anonymous",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/No token provided/i);
  });
});

describe("PUT /api/super-admin/personal-data/:id", () => {
  it("should return 404 if user not found", async () => {
    const superadminToken = jwt.sign(
      { userId: "superadmin-id", role: "superadmin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .put(
        `/api/super-admin/personal-data/5bd0eca0-ed9c-4647-b0fd-bffe6bf3ef88`
      )
      .set("Authorization", `Bearer ${superadminToken}`)
      .send({
        name: "Ghost",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/User not found/i);
  });
});

afterAll(async () => {
  await UserModel.sequelize?.close();
});
