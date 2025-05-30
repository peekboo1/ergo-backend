import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/infrastructure/db/models/UserModels";
import sequelize from "../../../src/config/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "your-secret-key";

describe("DELETE /api/personal/:id (user self delete)", () => {
  let userId: string;
  let token: string;

  beforeAll(async () => {
    await UserModel.destroy({ where: {} });

    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await UserModel.create({
      name: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
      role: "personal",
    });

    userId = user.id;
    token = jwt.sign({ userId, role: "personal" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  it("should delete the user when authenticated and authorized", async () => {
    const res = await request(app)
      .delete(`/api/personal/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted");

    const deletedUser = await UserModel.findByPk(userId);
    expect(deletedUser).toBeNull();
  });

  it("should return 403 if trying to delete another user's data", async () => {
    const otherUser = await UserModel.create({
      name: "Other User",
      email: "otheruser@example.com",
      password: await bcrypt.hash("password", 10),
      role: "personal",
    });

    const res = await request(app)
      .delete(`/api/personal/${otherUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Permission denied/i);
  });

  it("should return 403 if no token provided", async () => {
    const res = await request(app).delete(`/api/personal/${userId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/No token provided/i);
  });
});

describe("DELETE /api/super-admin/personal-data/:id (superadmin delete user)", () => {
  let userId: string;
  let superadminToken: string;

  beforeAll(async () => {
    await UserModel.destroy({ where: {} });

    const user = await UserModel.create({
      name: "User to Delete",
      email: "deleteuser@example.com",
      password: await bcrypt.hash("password", 10),
      role: "personal",
    });
    userId = user.id;

    superadminToken = jwt.sign(
      { userId: "superadmin-id", role: "superadmin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("should allow superadmin to delete any user", async () => {
    const res = await request(app)
      .delete(`/api/super-admin/personal-data/${userId}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted");

    const deletedUser = await UserModel.findByPk(userId);
    expect(deletedUser).toBeNull();
  });

  it("should return 404 if user not found", async () => {
    const nonExistentUUID = "123e4567-e89b-12d3-a456-426614174000";

    const res = await request(app)
      .delete(`/api/super-admin/personal-data/${nonExistentUUID}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.statusCode).toBe(400); 
    expect(res.body.message).toMatch(/User not found/i);
  });

  it("should return 403 if not superadmin", async () => {
    const normalUserToken = jwt.sign(
      { userId: "some-user-id", role: "personal" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .delete(`/api/super-admin/personal-data/${userId}`)
      .set("Authorization", `Bearer ${normalUserToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/superadmin only/i);
  });
});

afterAll(async () => {
  await UserModel.sequelize?.close();
});
