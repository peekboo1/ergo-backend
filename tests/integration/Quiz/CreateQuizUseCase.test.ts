import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("POST /api/quiz/create", () => {
  const endpoint = "/api/quiz/create";
  let companyId: string;
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

  afterAll(async () => {
    await QuizModel.destroy({ where: {}, force: true });
  });

  it("should create a new quiz successfully", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Quiz Test",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/created/i);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Quiz Test");
  });

  it("should fail to create quiz if title is missing", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/title.*required/i);
  });

  it("should fail to create quiz if token is not provided", async () => {
    const res = await request(app).post(endpoint).send({
      title: "Quiz Without Token",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/No Token/i);
  });

  it("should fail to create quiz if title is only whitespace", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "     ",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/title.*required/i);
  });
});
