import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("GET /api/division/get-all-division", () => {
  let companyId: string;
  let supervisorId: string;
  let token: string;

  beforeEach(async () => {
    await EmployeeModel.destroy({ where: {} });
    await DivisionModel.destroy({ where: {} });
    await SupervisorModel.destroy({ where: {} });
    await CompanyModel.destroy({ where: {} });

    const company = await CompanyModel.create({
      name: "Testing Company",
      phone: "6282219216616",
      address: "Test Address",
      email: "testing@ac.id",
      website: "testing.ac.id",
    });
    companyId = company.id;

    const supervisor = await SupervisorModel.create({
      name: "Supervisor Test",
      email: "supervisortest@example.com",
      password: await bcrypt.hash("testpassword", 10),
      role: "supervisor",
      companyId,
    });
    supervisorId = supervisor.id;
    token = createToken(supervisorId, "supervisor", companyId);
  });

  afterAll(async () => {
    await EmployeeModel.destroy({ where: {} });
    await DivisionModel.destroy({ where: {} });
    await SupervisorModel.destroy({ where: {} });
    await CompanyModel.destroy({ where: {} });
  });

  it("should found all division successfully", async () => {
    await DivisionModel.create({
      name: "Division Test",
      companyId,
    });

    const res = await request(app)
      .get("/api/division/get-all-division")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/retrieved successfully/i);
  });

  it("should return 404 if no division found", async () => {
    const res = await request(app)
      .get("/api/division/get-all-division")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  afterAll(async () => {
    await DivisionModel.sequelize?.close();
  });
});
