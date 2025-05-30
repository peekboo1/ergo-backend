import request from "supertest";
import app from "../../../src/app";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";

describe("GET /api/supervisor/:id", () => {
  const userId = "12a473e4-4768-4c12-8ff1-0b4903475929";
  const companyId = "e96ee7b9-3c90-4360-9b82-94ee93dcf809";
  const token = createToken(userId, "supervisor", companyId);

  beforeAll(async () => {
    await EmployeeModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });

    await CompanyModel.create({
      id: companyId,
      name: "Test Company",
      phone: "1234567890",
      address: "Jl. Test",
      email: "test@company.com",
      website: "test.com",
    });

    await SupervisorModel.create({
      id: userId,
      name: "Test User",
      email: "testuser@example.com",
      password: "hashed-password",
      role: "supervisor",
      companyId: companyId,
    });
  });

  afterAll(async () => {
    await SupervisorModel.sequelize?.close();
  });

  it("should return user data when given a valid ID", async () => {
    const res = await request(app)
      .get(`/api/supervisor/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id", userId);
  });

  it("should return 403 if accessing another user's data", async () => {
    const fakeId = "5bd0eca0-ed9c-4647-b0fd-bffe6bf3ef88";

    const res = await request(app)
      .get(`/api/supervisor/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/permission denied/i);
  });

  it("should return 403 if ID is invalid format", async () => {
    const invalidId = "invalid-id-format";

    const res = await request(app)
      .get(`/api/supervisor/${invalidId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/permission denied/i);
  });
});
