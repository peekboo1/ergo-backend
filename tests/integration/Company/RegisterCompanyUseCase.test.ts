import request from "supertest";
import app from "../../../src/app";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";

describe("POST /api/supervisor/register", () => {
  const endpoint = "/api/company/register";
  let companyId: string;

  beforeAll(async () => {
    await EmployeeModel.destroy({ where: {}, force: true });
    await SupervisorModel.destroy({ where: {}, force: true });
    await DivisionModel.destroy({ where: {}, force: true });
    await CompanyModel.destroy({ where: {}, force: true });
  });

  it("should register a new supervisor successfully", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Company Test",
      email: "Company@example.com",
      phone: "6281234567890",
      address: "Jl Test No. 123",
      website: "www.testcompany.com",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/company registered/i);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Company Test");
    expect(res.body.data.email).toBe("Company@example.com");
    expect(res.body.data.phone).toBe("6281234567890");
    expect(res.body.data.address).toBe("Jl Test No. 123");
    expect(res.body.data.website).toBe("www.testcompany.com");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Company Test",
      phone: "6281234567890",
      address: "Jl Test No. 123",
      website: "www.testcompany.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });
});
