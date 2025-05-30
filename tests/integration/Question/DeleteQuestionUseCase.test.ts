import app from "../../../src/app";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import request from "supertest";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";

const JWT_SECRET = "your-secret-key";

describe("DELETE /api/question/:questionId", () => {
  const endpoint = "/api/question/:questionId";
  let companyId: string;
  let supervisorId: string;
  let quizId: string;
  let token: string;
  let questionId: string;

  beforeAll(async () => {
    try {
      defineAssociations();
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

  it("should delete question successfully", async () => {
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Question deleted/i);

    const deletedQuestion = await QuestionModel.findByPk(questionId);
    expect(deletedQuestion).toBeNull();
  });

  it("should return 404 if question does not exist", async () => {
    const nonExistentQuestionId = "123e4567-e89b-12d3-a456-426614174000";
    const res = await request(app)
      .delete(`/api/question/${nonExistentQuestionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Question or quiz not found/i);
  });

  it("should return 403 if user is not authorized", async () => {
    const unauthorizedToken = jwt.sign(
      { userId: "some-user-id", role: "personal" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const unauthorizedQuestion = await QuestionModel.create({
      question: "Unauthorized Question",
      quizId,
    });
    const questionId = unauthorizedQuestion.id;
    const res = await request(app)
      .delete(`/api/question/${questionId}`)
      .set("Authorization", `Bearer ${unauthorizedToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Access Denied/i);
  });

  afterAll(async () => {
    await QuestionModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
  });
});
