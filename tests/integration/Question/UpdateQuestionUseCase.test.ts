import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { QuestionModel } from "../../../src/infrastructure/db/models/QuestionModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { defineAssociations } from "../../../src/infrastructure/db/models/Associations";
import bcrypt from "bcrypt";

describe("POST /api/question/:questionId", () => {
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

  afterAll(async () => {
    await QuestionModel.destroy({ where: {}, force: true });
    await QuizModel.destroy({ where: {}, force: true });
  });

  it("should update question successfully", async () => {
    const res = await request(app)
      .put(`/api/question/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Updated Question",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Question updated/i);
    expect(res.body.data.question).toBe("Updated Question");
  });

  it("should fail to update question if question text is empty", async () => {
    const res = await request(app)
      .put(`/api/question/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should fail to update question does not exist", async () => {
    const fakeId = "123e4567-e89b-12d3-a456-426614174000";

    const res = await request(app)
      .put(`/api/question/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Updated Nonexistent Quiz",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should fail to update question if no token is provided", async () => {
    const res = await request(app).put(`/api/question/${questionId}`).send({
      text: "Unauthorized Update",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should fail to update question if text is only whitespace", async () => {
    const res = await request(app)
      .put(`/api/question/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "     ",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });
});
