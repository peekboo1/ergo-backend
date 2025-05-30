import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("POST /api/division/register", () => {
  const endpoint = "/api/division/register";
  let companyId: string;
  let divisionId: string;
  let supervisorId: string;
  let token: string;

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

  it("should register a new division successfully", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Division Test",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/register successful/i);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Division Test");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });
});
