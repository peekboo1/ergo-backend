import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../../src/app";
import { SuperadminModel } from "../../../src/infrastructure/db/models/SuperadminModel";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { CompanyModel } from "../../../src/infrastructure/db/models/CompanyModels";
import { DivisionModel } from "../../../src/infrastructure/db/models/DivisionModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";
import { superAdminToken } from "../../../src/shared/utils/SuperadminToken";

describe("GET /api/company/get-all-company", () => {
  let token: string;

  beforeAll(async () => {
    try {
      await SuperadminModel.destroy({ where: {}, force: true });
      await EmployeeModel.destroy({ where: {}, force: true });
      await SupervisorModel.destroy({ where: {}, force: true });
      await DivisionModel.destroy({ where: {}, force: true });
      await CompanyModel.destroy({ where: {}, force: true });

      //   const hashedPassword = await bcrypt.hash("superadmin123", 10);

      //   const superadmin = await SuperadminModel.create({
      //     name: "Test Superadmin",
      //     email: "superadmintest@gmail.com",
      //     password: hashedPassword,
      //     role: "superadmin",
      //   });
      //   token = superAdminToken(superadmin.id, "superadmin");
    } catch (error) {
      console.error("Error in beforeAll:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    await CompanyModel.destroy({ where: {} });
  });

  it("should return all company", async () => {
    const company = await CompanyModel.bulkCreate([
      {
        name: "Test Company",
        phone: "1234567890",
        address: "Jl. Test",
        email: "test@company.com",
        website: "test.com",
      },
      {
        name: "Test Company",
        phone: "1234567890",
        address: "Jl. Test",
        email: "test@company.com",
        website: "test.com",
      },
    ]);
    const res = await request(app).get("/api/company/get-all-company");

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("should return 404 if no company found", async () => {
    const res = await request(app).get("/api/company/get-all-company");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/companies found/i);
  });
});

afterAll(async () => {
  await SupervisorModel.sequelize?.close();
});
