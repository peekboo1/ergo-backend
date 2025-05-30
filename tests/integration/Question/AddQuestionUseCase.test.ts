import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("POST /api/question/:quizId", () => {
  const endpoint = "/api/question/:quizId";
  let companyId: string;
  let supervisorId: string;
  let quizId: string;
  let token: string;

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await QuestionModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
  });

  it("should add question successfully", async () => {
    const res = await request(app)
      .post(`/api/question/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "What is the capital of France?",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/question added/i);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.question).toBe("What is the capital of France?");
    expect(res.body.data.quizId).toBe(quizId);
  });

  it("should fail to add question if text is missing", async () => {
    const res = await request(app)
      .post(`/api/question/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should fail to add question if text is empty", async () => {
    const res = await request(app)
      .post(`/api/question/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should fail to add question if text is only whitespace", async () => {
    const res = await request(app)
      .post(`/api/question/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "   ",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should fail to add question with invalid token", async () => {
    const res = await request(app)
      .post(`/api/question/${quizId}`)
      .set("Authorization", `Bearer invalid.token.here`)
      .send({
        text: "This should not be added",
      });

    expect(res.statusCode).toBe(403);
  });

  it("should fail if quizId does not exist", async () => {
    const res = await request(app)
      .post(`/api/question/non-existent-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Should fail due to invalid quizId",
      });

    expect([400, 500]).toContain(res.statusCode);
    expect(res.body.message).toMatch(/(not found|failed|invalid)/i);
  });
});
