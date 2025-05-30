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

describe("POST /api/option/:questionId", () => {
  const endpoint = "/api/option/:questionId";
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
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  it("should update question successfully", async () => {
    const res = await request(app)
      .post(`/api/option/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
          { text: "Option 3", isCorrect: false },
          { text: "Option 4", isCorrect: false },
        ],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/options added/i);
    expect(res.body.data).toBeDefined();
  });

  it("should fail to add question if text are missing", async () => {
    const res = await request(app)
      .post(`/api/option/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        options: [],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/options.*required/i);
  });

  it("should fail to add question if token is not provided", async () => {
    const res = await request(app)
      .post(`/api/option/${questionId}`)
      .send({
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
          { text: "Option 3", isCorrect: false },
          { text: "Option 4", isCorrect: false },
        ],
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/No Token/i);
  });

  it("should fail to add question with invalid token", async () => {
    const res = await request(app)
      .post(`/api/option/${questionId}`)
      .set("Authorization", `Bearer invalid.token.here`)
      .send({
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
          { text: "Option 3", isCorrect: false },
          { text: "Option 4", isCorrect: false },
        ],
      });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Invalid Token/i);
  });

  afterAll(async () => {
    await OptionModel.destroy({ where: {}, force: true });
    await QuestionModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
  });
});
