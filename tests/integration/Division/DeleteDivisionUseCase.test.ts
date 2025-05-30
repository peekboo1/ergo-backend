import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";

describe("DELETE /api/division/:id", () => {
  let token: string;
  let employeeId: string;
  let supervisorId: string;
  let companyId: string;
  let divisionId: string;

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

  it("should delete the division when authenticated and authorized", async () => {
    const res = await request(app)
      .delete(`/api/division/${divisionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Division deleted/i);

    const deletedDivision = await DivisionModel.findByPk(divisionId);
    expect(deletedDivision).toBeNull();
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app).delete(`/api/employee/${divisionId}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });
});

afterAll(async () => {
  await DivisionModel.sequelize?.close();
});
