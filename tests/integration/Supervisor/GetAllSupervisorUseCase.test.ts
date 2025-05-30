import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { SuperadminModel } from "../../../src/infrastructure/db/models/SuperadminModel";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { superAdminToken } from "../../../src/shared/utils/SuperadminToken";

describe("GET /api/super-admin/get-all-supervisors", () => {
  let token: string;

  beforeAll(async () => {
    try {
      await SuperadminModel.destroy({ where: {}, force: true });
      await EmployeeModel.destroy({ where: {}, force: true });
      await SupervisorModel.destroy({ where: {}, force: true });
      await DivisionModel.destroy({ where: {}, force: true });
      await CompanyModel.destroy({ where: {}, force: true });

      const hashedPassword = await bcrypt.hash("superadmin123", 10);

      const superadmin = await SuperadminModel.create({
        name: "Test Superadmin",
        email: "superadmintest@gmail.com",
        password: hashedPassword,
        role: "superadmin",
      });
      token = superAdminToken(superadmin.id, "superadmin");
    } catch (error) {
      console.error("Error in beforeAll:", error);
      throw error; // Re-throw to fail the test suite
    }
  });

  beforeEach(async () => {
    await SupervisorModel.destroy({ where: {} });
  });

  it("should return all users when superadmin is authenticated", async () => {
    const company = await CompanyModel.create({
      name: "Test Company",
      phone: "1234567890",
      address: "Jl. Test",
      email: "test@company.com",
      website: "test.com",
    });

    await SupervisorModel.bulkCreate([
      {
        name: "User One",
        email: "user1@example.com",
        password: "pass123",
        role: "supervisor",
        companyId: company.id,
      },
      {
        name: "User Two",
        email: "user2@example.com",
        password: "pass456",
        role: "supervisor",
        companyId: company.id,
      },
    ]);

    const res = await request(app)
      .get("/api/super-admin/get-all-supervisors")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("should return 404 if no users found", async () => {
    const res = await request(app)
      .get("/api/super-admin/get-all-supervisors")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/super-admin/get-all-supervisors");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return 403 if role is not superadmin", async () => {
    const fakeToken = superAdminToken("fake-id", "personal");

    const res = await request(app)
      .get("/api/super-admin/get-all-supervisors")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/superadmin only/i);
  });
});

afterAll(async () => {
  await SupervisorModel.sequelize?.close();
});
