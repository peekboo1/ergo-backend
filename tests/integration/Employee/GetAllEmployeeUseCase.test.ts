import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { SuperadminModel } from "../../../src/infrastructure/db/models/SuperadminModel";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { superAdminToken } from "../../../src/shared/utils/SuperadminToken";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";

describe("GET /api/super-admin/get-all-employees", () => {
  let token: string;
  let companyId: string;
  let divisionId: string;
  let supervisorId: string;

  beforeAll(async () => {
    try {
      defineAssociations();

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

      const company = await CompanyModel.create({
        name: "Test Company",
        phone: "1234567890",
        address: "Jl. Test",
        email: "test@company.com",
        website: "test.com",
      });
      companyId = company.id;

      const division = await DivisionModel.create({
        name: "Division A",
        companyId,
      });
      divisionId = division.id;

      const supervisor = await SupervisorModel.create({
        name: "Supervisor A",
        email: "spv@example.com",
        password: await bcrypt.hash("password", 10),
        role: "supervisor",
        companyId,
      });
      supervisorId = supervisor.id;
    } catch (error) {
      console.error("Error in beforeAll:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    await EmployeeModel.destroy({ where: {} });
  });

  it("should return all employees when superadmin is authenticated", async () => {
    await EmployeeModel.bulkCreate([
      {
        name: "Employee One",
        email: "emp1@example.com",
        password: await bcrypt.hash("pass123", 10),
        role: "employee",
        companyId,
        divisionId,
        supervisorId,
      },
      {
        name: "Employee Two",
        email: "emp2@example.com",
        password: await bcrypt.hash("pass456", 10),
        role: "employee",
        companyId,
        divisionId,
        supervisorId,
      },
    ]);

    const res = await request(app)
      .get("/api/super-admin/get-all-employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.data).toHaveLength(2);
    expect(res.body.data.total).toBe(2);
  });

  it("should return 404 if no employees found", async () => {
    const res = await request(app)
      .get("/api/super-admin/get-all-employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/super-admin/get-all-employees");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return 403 if role is not superadmin", async () => {
    const fakeToken = superAdminToken("fake-id", "personal");

    const res = await request(app)
      .get("/api/super-admin/get-all-employees")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/superadmin only/i);
  });
});

afterAll(async () => {
  await EmployeeModel.sequelize?.close();
});
