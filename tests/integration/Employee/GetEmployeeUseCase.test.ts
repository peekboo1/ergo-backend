import request from "supertest";
import app from "../../../src/app";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import bcrypt from "bcryptjs";

describe("GET /api/employee/:id", () => {
  let employeeId: string;
  let token: string;
  let companyId: string;
  let divisionId: string;
  let supervisorId: string;

  beforeAll(async () => {
    await EmployeeModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });

    const company = await CompanyModel.create({
      name: "Test Company",
      phone: "1234567890",
      address: "Jl. Test",
      email: "test@company.com",
      website: "test.com",
    });
    companyId = company.id;

    const division = await DivisionModel.create({
      name: "Test Division",
      companyId,
    });
    divisionId = division.id;

    const supervisor = await SupervisorModel.create({
      name: "Test Supervisor",
      email: "supervisor@example.com",
      password: await bcrypt.hash("password", 10),
      role: "supervisor",
      companyId,
    });
    supervisorId = supervisor.id;
    token = createToken(supervisorId, "supervisor", companyId);

    const employee = await EmployeeModel.create({
      name: "Test Employee",
      email: "employee@example.com",
      password: await bcrypt.hash("password", 10),
      role: "employee",
      companyId,
      divisionId: division.id,
      supervisorId,
    });
    employeeId = employee.id;
  });

  afterAll(async () => {
    await EmployeeModel.sequelize?.close();
  });

  it("should return employee data when given a valid ID", async () => {
    const res = await request(app)
      .get(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id", employeeId);
  });

  it("should return 403 if accessing another supervisor's employee", async () => {
    const anotherSupervisor = await SupervisorModel.create({
      name: "Supervisor B",
      email: "spv-b@example.com",
      password: await bcrypt.hash("password", 10),
      role: "supervisor",
      companyId,
    });

    const otherEmployee = await EmployeeModel.create({
      name: "Other Employee",
      email: "other@employee.com",
      password: await bcrypt.hash("password", 10),
      role: "employee",
      divisionId: divisionId,
      supervisorId: anotherSupervisor.id,
      companyId: companyId,
    });

    const res = await request(app)
      .get(`/api/employee/${otherEmployee.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/forbidden/i);
  });

  it("should return 403 if ID is invalid format", async () => {
    const res = await request(app)
      .get(`/api/employee/invalid-id-format`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/Invalid/i);
  });
});
