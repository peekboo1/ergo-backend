import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";

describe("PUT /api/employee/:id", () => {
  let employeeId: string;
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

    const employee = await EmployeeModel.create({
      name: "Original Employee",
      email: "employee@original.com",
      password: await bcrypt.hash("password123", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });

    employeeId = employee.id;
    token = createToken(supervisorId, "supervisor", companyId);
  });

  it("should successfully update employee's name and email", async () => {
    const res = await request(app)
      .put(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Employee",
        email: "updated@employee.com",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/employee updated/i);
    expect(res.body.data.name).toBe("Updated Employee");
    expect(res.body.data.email).toBe("updated@employee.com");
  });

  it("should hash new password when updated", async () => {
    const res = await request(app)
      .put(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "newSecurePass",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/employee updated/i);

    const updated = await EmployeeModel.findByPk(employeeId);
    expect(updated).toBeTruthy();
    const isPasswordCorrect = await bcrypt.compare(
      "newSecurePass",
      updated!.password
    );
    expect(isPasswordCorrect).toBe(true);
  });

  it("should return 400 if email is already in use", async () => {
    await EmployeeModel.create({
      name: "Conflict Employee",
      email: "conflict@employee.com",
      password: await bcrypt.hash("password", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });

    const res = await request(app)
      .put(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "conflict@employee.com",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already in use");
  });

  it("should return 403 if token is missing", async () => {
    const res = await request(app)
      .put(`/api/employee/${employeeId}`)
      .send({ name: "Unauthorized Update" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return 403 if token belongs to different user", async () => {
    const otherToken = createToken("fake-id", "supervisor", "wrong-company");

    const res = await request(app)
      .put(`/api/employee/${employeeId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ name: "Invalid User Update" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/forbidden/i);
  });
});

afterAll(async () => {
  await EmployeeModel.sequelize?.close();
});
