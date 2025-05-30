import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";

describe("DELETE /api/employee/:id", () => {
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

    const employee = await EmployeeModel.create({
      name: "Employee A",
      email: "employee@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });

    employeeId = employee.id;
  });

  it("should return 403 if token is invalid or belongs to wrong user", async () => {
    const invalidToken = createToken("fake-id", "supervisor", "wrong-company");

    const res = await request(app)
      .delete(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/forbidden/i);
  });

  it("should delete the employee when authenticated and authorized", async () => {
    const res = await request(app)
      .delete(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/employee deleted/i);

    const deletedEmployee = await EmployeeModel.findByPk(employeeId);
    expect(deletedEmployee).toBeNull();
  });

  it("should return 403 if supervisor tries to delete another supervisor's employee", async () => {
    const anotherSupervisor = await SupervisorModel.create({
      name: "Another Supervisor",
      email: "another@spv.com",
      password: await bcrypt.hash("password", 10),
      role: "supervisor",
      companyId,
    });

    const anotherEmployee = await EmployeeModel.create({
      name: "Other Employee",
      email: "other@employee.com",
      password: await bcrypt.hash("password", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId: anotherSupervisor.id,
    });

    const res = await request(app)
      .delete(`/api/employee/${anotherEmployee.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Forbidden/i);
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app).delete(`/api/employee/${employeeId}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });
});

afterAll(async () => {
  await EmployeeModel.sequelize?.close();
});
