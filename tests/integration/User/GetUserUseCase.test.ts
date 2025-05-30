import request from "supertest";
import app from "../../../src/app";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { UserModel } from "../../../src/infrastructure/db/models/UserModels";
import sequelize from "../../../src/config/database";

describe("GET /api/personal/:id", () => {
  const userId = "12a473e4-4768-4c12-8ff1-0b4903475929";
  const token = createToken(userId, "personal", null);

  beforeAll(async () => {
    await UserModel.destroy({ where: { id: userId } });
    await UserModel.create({
      id: userId,
      name: "Test User",
      email: "testuser@example.com",
      password: "hashed-password",
      role: "personal",
    });
  });

  afterAll(async () => {
    await UserModel.sequelize?.close();
  });

  it("should return user data when given a valid ID", async () => {
    const res = await request(app)
      .get(`/api/personal/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    // console.log("🧾 Response status:", res.statusCode);
    // console.log("📦 Response body:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id", userId);
  });

  it("should return 403 if accessing another user's data", async () => {
    const fakeId = "5bd0eca0-ed9c-4647-b0fd-bffe6bf3ef88";

    const res = await request(app)
      .get(`/api/personal/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    // console.log("🧾 Forbidden Access Test - Response status:", res.statusCode);
    // console.log("📦 Forbidden Access Test - Response body:", res.body);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/permission denied/i);
  });

  it("should return 403 if ID is invalid format", async () => {
    const invalidId = "invalid-id-format";

    const res = await request(app)
      .get(`/api/personal/${invalidId}`)
      .set("Authorization", `Bearer ${token}`);

    // console.log("🧾 Invalid ID Format Test - Response status:", res.statusCode);
    // console.log("📦 Invalid ID Format Test - Response body:", res.body);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/permission denied/i);
  });
});
