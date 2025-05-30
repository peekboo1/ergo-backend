import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("POST /api/auth/login", () => {
  const endpoint = "/api/auth/login";
  let companyId: string;
  let supervisorId: string;
  let token: string;

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

  it("should login successfully with valid credentials", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@supervisor.com",
      password: "originalPassword",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.token).toBe(token);
  });

  it("should fail login with invalid email", async () => {
    const res = await request(app).post(endpoint).send({
      email: "mamama@gmail.com",
      password: "originalPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email not found");
  });

  it("should fail login with invalid password", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@supervisor.com",
      password: "wrongPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should fail login with empty email", async () => {
    const res = await request(app).post(endpoint).send({
      email: "",
      password: "originalPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email not found");
  });

  it("should fail login with empty password", async () => {
    const res = await request(app).post(endpoint).send({
      email: "original@supervisor.com",
      password: "",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
