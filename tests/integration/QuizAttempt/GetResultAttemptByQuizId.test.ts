import app from "../../../src/app";
import request from "supertest";
import bcrypt from "bcrypt";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { QuizAttemptModel } from "../../../src/infrastructure/db/models/QuizAttemptModels";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";

describe("GET /api/quiz-attempt/:quizId", () => {
  const endpoint = "/api/quiz-attempt";
  let companyId: string;
  let divisionId: string;
  let supervisorId: string;
  let employeeId: string;
  let token: string;
  let quizId: string;

  beforeAll(async () => {
    defineAssociations();

    await QuizAttemptModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
    await EmployeeModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });

    const company = await CompanyModel.create({
      name: "Test Company",
      phone: "081234567890",
      address: "Jl. Testing",
      email: "test@company.com",
      website: "testcompany.com",
    });
    companyId = company.id;

    const supervisor = await SupervisorModel.create({
      name: "Supervisor Test",
      email: "supervisor@test.com",
      password: await bcrypt.hash("supervisorpass", 10),
      role: "supervisor",
      companyId,
    });
    supervisorId = supervisor.id;
    token = createToken(supervisorId, "supervisor", companyId);

    const division = await DivisionModel.create({
      name: "Division Test",
      companyId,
    });
    divisionId = division.id;

    const employee = await EmployeeModel.create({
      name: "Employee Test",
      email: "employee@test.com",
      password: await bcrypt.hash("employeepass", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });
    employeeId = employee.id;

    const quiz = await QuizModel.create({
      title: "Supervisor Quiz",
      supervisorId,
    });
    quizId = quiz.id;

    await QuizAttemptModel.create({
      quizId,
      userId: employeeId,
      score: 80,
    });
  });

  it("should return quiz attempt result successfully", async () => {
    const res = await request(app)
      .get(`${endpoint}/${quizId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/success/i);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toMatchObject({
      quizId,
      userId: employeeId,
      quizName: "Supervisor Quiz",
      employeeName: "Employee Test",
      score: 80,
    });
  });

  it("should return 403 if no token is provided", async () => {
    const res = await request(app).get(`${endpoint}/${quizId}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return empty array if no attempt exists for the quiz", async () => {
    const quizWithoutAttempts = await QuizModel.create({
      title: "No Attempt Quiz",
      supervisorId,
    });

    const res = await request(app)
      .get(`${endpoint}/${quizWithoutAttempts.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  afterAll(async () => {
    await QuizAttemptModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
    await EmployeeModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });
  });
});
