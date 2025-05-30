import app from "../../../src/app";
import bcrypt from "bcrypt";
import request from "supertest";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { OptionModel } from "../../../src/infrastructure/db/models/OptionModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";

describe("GET /api/question/:quizId", () => {
  const endpoint = "/api/question/:quizId";
  let companyId: string;
  let supervisorId: string;
  let quizId: string;
  let token: string;
  let questionId: string;

  beforeAll(async () => {
    try {
      defineAssociations();
      await OptionModel.destroy({ where: {}, force: true });
      await QuestionModel.destroy({ where: {}, force: true });
      await QuizModel.destroy({ where: {}, force: true });
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

      const quiz = await QuizModel.create({
        title: "Initial Quiz",
        supervisorId,
      });
      quizId = quiz.id;

      const question = await QuestionModel.create({
        question: "Sample Question",
        quizId,
      });
      questionId = question.id;

      await OptionModel.bulkCreate([
        { text: "Ce Gaby", isCorrect: false, questionId },
        { text: "Ko Ryan", isCorrect: true, questionId },
        { text: "Ce Gaby", isCorrect: false, questionId },
        { text: "Ce Amel", isCorrect: false, questionId },
      ]);
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  it("should get question and option successfully", async () => {
    const res = await request(app)
      .get(`/api/question/${quizId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/questions retrieved/i);
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 if no questions found for the quiz", async () => {
    await QuestionModel.destroy({ where: { quizId } });
    const res = await request(app)
      .get(`/api/question/${quizId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/question or quiz not found/i);
  });

  it("should return 403 if no token is provided", async () => {
    const res = await request(app).get(`/api/question/${quizId}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return 404 if quiz does not exist", async () => {
    const res = await request(app)
      .get(`/api/question/b6fffe7f-724b-245f-b29a-ebfec99b8d72`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  afterAll(async () => {
    await OptionModel.destroy({ where: {}, force: true });
    await QuestionModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
  });
});