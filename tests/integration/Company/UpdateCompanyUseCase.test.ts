import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import jwt from "jsonwebtoken";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";

const JWT_SECRET = "your-secret-key";

describe("PUT /api/company/:id", () => {
  let supervisorId: string;
  let token: string;
  let companyId: string;

  beforeAll(async () => {
    await EmployeeModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });

    const company = await CompanyModel.create({
        name: "Testing Company",
      phone: "6282219216616",
      address: "Test Address",
      email: "testing@ac.id",
      website: "testing.ac.id",
    });

    companyId = company.id;

    const password = await bcrypt.hash("originalPassword", 10);
    const supervisor = await SupervisorModel.create({
      name: "Original Supervisor",
      email: "original@supervisor.com",
      password,
      role: "supervisor",
      companyId,
    });

    supervisorId = supervisor.id;
    token = createToken(supervisor.id, "supervisor", supervisor.companyId);
  });

  it("should successfully update supervisor's name and email", async () => {
    const res = await request(app)
      .put(`/api/company/${companyId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
        email: "updated@company.com",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Company updated/i);
    expect(res.body.data.name).toBe("Updated Name");
    expect(res.body.data.email).toBe("updated@company.com");
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app)
      .put(`/api/company/${companyId}`)
      .send({ name: "No Auth" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  //   it("should return 403 if token belongs to different user", async () => {
  //     const otherToken = createToken("someone-else", "supervisor", "company-123");

  //     const res = await request(app)
  //       .put(`/api/supervisor/${supervisorId}`)
  //       .set("Authorization", `Bearer ${otherToken}`)
  //       .send({ name: "Hack Attempt" });

  //     expect(res.statusCode).toBe(403);
  //     expect(res.body.message).toMatch(/denied/i);
  //   });
});

afterAll(async () => {
  await SupervisorModel.sequelize?.close();
});
