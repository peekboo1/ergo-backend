import request from "supertest";
import app from "../../../src/app";
import { SuperadminModel } from "../../../src/infrastructure/db/models/SuperadminModel";
import { UserModel } from "../../../src/infrastructure/db/models/UserModels";
import bcrypt from "bcryptjs";
import { superAdminToken } from "../../../src/shared/utils/SuperadminToken";

describe("GET /api/super-admin/get-all-users", () => {
  let token: string;

  beforeAll(async () => {
    await SuperadminModel.destroy({ where: {} });
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    const superadmin = await SuperadminModel.create({
      name: "Test Superadmin",
      email: "superadmintest@gmail.com",
      password: hashedPassword,
    });

    token = superAdminToken(superadmin.id, "superadmin");
  });

  beforeEach(async () => {
    await UserModel.destroy({ where: {} });
  });

  it("should return all users when superadmin is authenticated", async () => {
    await UserModel.bulkCreate([
      {
        name: "User One",
        email: "user1@example.com",
        password: "pass123",
        role: "personal",
      },
      {
        name: "User Two",
        email: "user2@example.com",
        password: "pass456",
        role: "personal",
      },
    ]);

    const res = await request(app)
      .get("/api/super-admin/get-all-users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("should return 404 if no users found", async () => {
    const res = await request(app)
      .get("/api/super-admin/get-all-users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No users found");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/super-admin/get-all-users");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return 403 if role is not superadmin", async () => {
    const fakeToken = superAdminToken("fake-id", "personal");

    const res = await request(app)
      .get("/api/super-admin/get-all-users")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/superadmin only/i);
  });
});

afterAll(async () => {
  await UserModel.sequelize?.close();
});
