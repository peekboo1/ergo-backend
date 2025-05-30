import app from "../../../src/app";
import request from "supertest";
import bcrypt from "bcrypt";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { OptionModel } from "../../../src/infrastructure/db/models/OptionModels";
import { QuizAttemptModel } from "../../../src/infrastructure/db/models/QuizAttemptModels";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";
import { UserAnswerModel } from "../../../src/infrastructure/db/models/UserAnswerModels";

describe("GET /api/quiz-attempt/detail-history/:id", () => {
  const endpoint = "/api/quiz-attempt/detail-history";
  let companyId: string;
  let divisionId: string;
  let supervisorId: string;
  let employeeId: string;
  let spvToken: string;
  let token: string;
  let questionId: string;
  let optionId: string;

  beforeAll(async () => {
    defineAssociations();

    await UserAnswerModel.destroy({ where: {}, force: true });
    await QuizAttemptModel.destroy({ where: {}, force: true });
    await OptionModel.destroy({ where: {}, force: true });
    await QuestionModel.destroy({ where: {}, force: true });
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
    spvToken = createToken(supervisorId, "supervisor", companyId);
    token = createToken(employeeId, "employee", companyId);

    const quiz = await QuizModel.create({
      title: "History Quiz",
      supervisorId,
    });

    const question = await QuestionModel.create({
      question: "Who is the CEO?",
      quizId: quiz.id,
    });
    questionId = question.id;

    const options = await OptionModel.bulkCreate(
      [
        { text: "John", isCorrect: true, questionId },
        { text: "Doe", isCorrect: false, questionId },
        { text: "Jane", isCorrect: false, questionId },
        { text: "Smith", isCorrect: false, questionId },
      ],
      { returning: true }
    );
    optionId = options[0].id;

    const quizAttempt = await QuizAttemptModel.create({
      quizId: quiz.id,
      userId: employeeId,
    });

    await UserAnswerModel.create({
      attemptId: quizAttempt.id,
      userId: employeeId,
      selectedOptionId: optionId,
    });
  });

  it("should return quiz history successfully", async () => {
    const res = await request(app)
      .get(`${endpoint}/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/retrieved successfully/i);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("quiz_title", "History Quiz");
    expect(res.body.data[0]).toHaveProperty("answers");
    expect(res.body.data[0].answers[0]).toMatchObject({
      text: "John",
      isCorrect: true,
    });
  });

  it("should return 403 if no token is provided", async () => {
    const res = await request(app).get(`${endpoint}/${employeeId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return empty array if user has no history", async () => {
    const newEmployee = await EmployeeModel.create({
      name: "No History User",
      email: "nohistory@test.com",
      password: await bcrypt.hash("nohistorypass", 10),
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

  it("should return 404 if employee not found", async () => {
    const res = await request(app)
      .get(`${endpoint}/b6fffe7f-724b-445f-b69a-ebfec99b8d74`)
      .set("Authorization", `Bearer ${spvToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/employee not found/i);
  });

  afterAll(async () => {
    await UserAnswerModel.destroy({ where: {}, force: true });
    await QuizAttemptModel.destroy({ where: {}, force: true });
    await OptionModel.destroy({ where: {}, force: true });
    await QuestionModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
    await EmployeeModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });
  });
});
