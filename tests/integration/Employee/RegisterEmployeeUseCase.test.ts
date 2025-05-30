import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("POST /api/supervisor/register", () => {
  const endpoint = "/api/employee/register";
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

    const division = await DivisionModel.create({
      name: "Division Test",
      companyId,
    });
    divisionId = division.id;

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

  it("should register a new employee successfully", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Employee Test",
        email: "employee@example.com",
        password: "password123",
        role: "employee",
        companyId,
        supervisorId,
        divisionId,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/employee registered/i);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Employee Test");
    expect(res.body.data.email).toBe("employee@example.com");

    const employee = await EmployeeModel.findOne({
      where: { email: "employee@example.com" },
    });

    expect(employee).not.toBeNull();
    const isPasswordHashed = await bcrypt.compare(
      "password123",
      employee!.password
    );
    expect(isPasswordHashed).toBe(true);
  });

  it("should fail if email already exists", async () => {
    await EmployeeModel.create({
      name: "Duplicate Employee",
      email: "dupe@example.com",
      password: await bcrypt.hash("dupepass", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });

    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Another Employee",
        email: "dupe@example.com",
        password: "somepass",
        role: "employee",
        companyId,
        divisionId,
        supervisorId,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/email already in use/i);
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "incomplete@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/all fields are required/i);
  });

  it("should return 401 on internal error (e.g., empty companyId)", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Employee Crash",
        email: "crash@example.com",
        password: "password123",
        role: "employee",
        companyId,
        divisionId: "",
        supervisorId,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/all fields are required/i);
  });
});
