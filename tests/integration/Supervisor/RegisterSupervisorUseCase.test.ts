import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import bcrypt from "bcrypt";

describe("POST /api/supervisor/register", () => {
  const endpoint = "/api/supervisor/register";
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
  });

  it("should register a new supervisor successfully", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Supervisor Satu",
      email: "supervisor1@example.com",
      password: "password123",
      companyId,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Register Successfull");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Supervisor Satu");
    expect(res.body.data.email).toBe("supervisor1@example.com");

    const supervisor = await SupervisorModel.findOne({
      where: { email: "supervisor1@example.com" },
    });

    expect(supervisor).not.toBeNull();
    const isPasswordHashed = await bcrypt.compare(
      "password123",
      supervisor!.password
    );
    expect(isPasswordHashed).toBe(true);
  });

  it("should fail if email already exists", async () => {
    await SupervisorModel.create({
      name: "Duplicate",
      email: "dupe@example.com",
      password: await bcrypt.hash("dupepass", 10),
      role: "supervisor",
      companyId,
    });

    const res = await request(app).post(endpoint).send({
      name: "Another Supervisor",
      email: "dupe@example.com",
      password: "somepass",
      companyId,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/email already in use/i);
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post(endpoint).send({
      email: "incomplete@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/all fields are required/i);
  });

  it("should return 400 on internal error", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Supervisor Crash",
      email: "crash@example.com",
      password: "password123",
      companyId: "", // kosong bikin gagal
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/all fields are required/i);
  });
});
