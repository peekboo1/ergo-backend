import app from "../../../src/app";
import bcrypt from "bcrypt";
import request from "supertest";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { OptionModel } from "../../../src/infrastructure/db/models/OptionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";
import { QuizAttemptModel } from "../../../src/infrastructure/db/models/QuizAttemptModels";

describe("POST /api/quiz-attempt/submit/:quizId", () => {
  const endpoint = "/api/quiz-attempt/submit/:quizId";
  let companyId: string;
  let questionId: string;
  let supervisorId: string;
  let divisionId: string;
  let employeeId: string;
  let optionId: string;
  let quizAttemptId: string;
  let quizId: string;
  let token: string;

  beforeAll(async () => {
    try {
      defineAssociations();
      await QuizAttemptModel.destroy({ where: {}, force: true });
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

      const division = await DivisionModel.create({
        name: "Division A",
        companyId,
      });
      divisionId = division.id;

      const employee = await EmployeeModel.create({
        name: "Original Employee",
        email: "employee@original.com",
        password: await bcrypt.hash("password123", 10),
        role: "employee",
        companyId,
        divisionId,
        supervisorId,
      });
      employeeId = employee.id;
      token = createToken(employeeId, "employee", companyId);

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

      const options = await OptionModel.bulkCreate(
        [
          { text: "Ce Gaby", isCorrect: false, questionId },
          { text: "Ko Ryan", isCorrect: true, questionId },
          { text: "Ce Gaby", isCorrect: false, questionId },
          { text: "Ce Amel", isCorrect: false, questionId },
        ],
        { returning: true }
      );
      optionId = options[2].id;

      const quizAttempt = await QuizAttemptModel.create({
        quizId,
        userId: employeeId,
      });
      quizAttemptId = quizAttempt.id;
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  it("should submit answer successfully", async () => {
    const res = await request(app)
      .post(`/api/quiz-attempt/submit/${quizAttemptId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        questionId: questionId,
        optionId: optionId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Answer submitted/i);
  });

  it("should return 404 if quiz attempt not found", async () => {
    const res = await request(app)
      .post("/api/quiz-attempt/submit/546a7e56-9eae-42b0-8d66-aa9293e83e0d")
      .set("Authorization", `Bearer ${token}`)
      .send({
        questionId: questionId,
        optionId: optionId,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/quiz attempt not found/i);
  });

  it("should return 404 if question not found", async () => {
    const fakeQuestionId = "123e4567-e89b-12d3-a456-426614174000";
    const res = await request(app)
      .post(`/api/quiz-attempt/submit/${quizAttemptId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        questionId: fakeQuestionId,
        optionId: optionId,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/question not found/i);
  });

  it("should return 404 if option not found", async () => {
    const fakeOptionId = "123e4567-e89b-12d3-a456-426614174000";
    const res = await request(app)
      .post(`/api/quiz-attempt/submit/${quizAttemptId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        questionId: questionId,
        optionId: fakeOptionId,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/option not found/i);
  });

  it("should return 403 if no token is provided", async () => {
    const res = await request(app)
      .post(`/api/quiz-attempt/submit/${quizAttemptId}`)
      .send({
        questionId: questionId,
        optionId: optionId,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  afterAll(async () => {
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
