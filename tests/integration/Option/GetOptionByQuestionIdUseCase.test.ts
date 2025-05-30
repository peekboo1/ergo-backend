import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { OptionModel } from "../../../src/infrastructure/db/models/OptionModels";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";

describe("GET /api/option/:questionId", () => {
  const endpoint = "/api/option/:questionId";
  let companyId: string;
  let questionId: string;
  let supervisorId: string;
  let quizId: string;
  let token: string;

  beforeAll(async () => {
    try {
      defineAssociations();
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

  it("should return option data successfully", async () => {
    const res = await request(app)
      .get(`/api/option/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should return 404 if no options found for the question", async () => {
    await OptionModel.destroy({ where: { questionId } });
    const res = await request(app)
      .get(`/api/option/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/no options found/i);
  });

  it("should return 403 if no token is provided", async () => {
    const res = await request(app).get(`/api/option/${questionId}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should return 404 if question does not exist", async () => {
    const res = await request(app)
      .get(`/api/option/32e2c6fc-8b00-4833-a50e-6f70f6102b00`)
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
