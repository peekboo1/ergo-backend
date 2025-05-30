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

describe("GET /api/quiz-attempt/spv-history", () => {
  const endpoint = "/api/quiz-attempt/spv-history";
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
      .get(`${endpoint}`)
      .set("Authorization", `Bearer ${spvToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/success get employee/i);
  });

  it("should return 403 for unauthorized access", async () => {
    const res = await request(app).get(`${endpoint}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/denied/i);
  });

  it("should return 403 if no token is provided", async () => {
    const res = await request(app).get(`${endpoint}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
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
