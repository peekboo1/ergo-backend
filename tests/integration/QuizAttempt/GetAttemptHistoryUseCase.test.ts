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

describe("GET /api/quiz-attempt/history/:id", () => {
  const endpoint = "/api/quiz-attempt/history";
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
      name: "Test Corp",
      phone: "081234567890",
      address: "Jl. Test",
      email: "company@test.com",
      website: "testcorp.com",
    });
    companyId = company.id;

    const supervisor = await SupervisorModel.create({
      name: "Supervisor One",
      email: "supervisor@test.com",
      password: await bcrypt.hash("password", 10),
      role: "supervisor",
      companyId,
    });
    supervisorId = supervisor.id;

    const division = await DivisionModel.create({
      name: "Division 1",
      companyId,
    });
    divisionId = division.id;

    const employee = await EmployeeModel.create({
      name: "Test Employee",
      email: "employee@test.com",
      password: await bcrypt.hash("password", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });
    employeeId = employee.id;
    token = createToken(employeeId, "employee", companyId);

    const quiz = await QuizModel.create({
      title: "Ergo Quiz",
      supervisorId,
    });
    quizId = quiz.id;

    await QuizAttemptModel.create({
      quizId,
      userId: employeeId,
      score: 85,
    });
  });

  it("should return attempt history successfully", async () => {
    const res = await request(app)
      .get(`${endpoint}/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/ergonomic history fetched/i);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toMatchObject({
      quizId: quizId,
      userId: employeeId,
      score: 85,
    });
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get(`${endpoint}/${employeeId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return empty array if user has no history", async () => {
    const newEmployee = await EmployeeModel.create({
      name: "No History User",
      email: "new@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "employee",
      companyId,
      divisionId,
      supervisorId,
    });
    const newToken = createToken(newEmployee.id, "employee", companyId);

    const res = await request(app)
      .get(`${endpoint}/${newEmployee.id}`)
      .set("Authorization", `Bearer ${newToken}`);

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
