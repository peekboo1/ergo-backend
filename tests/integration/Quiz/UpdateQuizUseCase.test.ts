import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("PUT /api/quiz/update/:quizId", () => {
  const endpoint = "/api/quiz/update/:quizId";
  let companyId: string;
  let supervisorId: string;
  let quizId: string;
  let token: string;

  beforeAll(async () => {
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
    await QuizModel.destroy({ where: {}, force: true });
  });

  it("should update quiz successfully", async () => {
    const res = await request(app)
      .put(`/api/quiz/update/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Quiz updated/i);
    expect(res.body.data.title).toBe("Updated Title");
  });

  it("should fail to update quiz if title is empty", async () => {
    const res = await request(app)
      .put(`/api/quiz/update/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should fail to update quiz if quiz does not exist", async () => {
    const fakeId = "123e4567-e89b-12d3-a456-426614174000";

    const res = await request(app)
      .put(`/api/quiz/update/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Nonexistent Quiz",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should fail to update quiz if no token is provided", async () => {
    const res = await request(app).put(`/api/quiz/update/${quizId}`).send({
      title: "Unauthorized Update",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  it("should fail to update quiz if title is only whitespace", async () => {
    const res = await request(app)
      .put(`/api/quiz/update/${quizId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "     ",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/required/i);
  });
});
