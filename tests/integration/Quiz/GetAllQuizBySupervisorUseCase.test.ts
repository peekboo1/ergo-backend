import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { QuizModel } from "../../../src/infrastructure/db/models/QuizModels";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import bcrypt from "bcrypt";

describe("GET /api/quiz/get-quiz", () => {
  const endpoint = "/api/quiz/get-quiz";
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

  it("should return quiz data successfully", async () => {
    const res = await request(app)
      .get(`/api/quiz/get-quiz`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("should return 404 if no quiz found", async () => {
    await QuizModel.destroy({ where: { id: quizId } });
    const res = await request(app)
      .get("/api/quiz/get-quiz")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/quiz/get-quiz");
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/no token/i);
  });

  afterAll(async () => {
    await QuizModel.destroy({ where: {}, force: true });
  });
});
