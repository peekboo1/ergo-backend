import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";

describe("PUT /api/division/:id", () => {
  let token: string;
  let companyId: string;
  let divisionId: string;
  let supervisorId: string;

  beforeAll(async () => {
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
    token = createToken(supervisorId, "supervisor", companyId);
  });

  it("should successfully update division's name and email", async () => {
    const res = await request(app)
      .put(`/api/division/${divisionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Division",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/division updated/i);
    expect(res.body.data.name).toBe("Updated Division");
  });

  it("should return 403 if token is missing", async () => {
    const res = await request(app)
      .put(`/api/division/${divisionId}`)
      .send({ name: "Unauthorized Update" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });
});

afterAll(async () => {
  await DivisionModel.sequelize?.close();
});
