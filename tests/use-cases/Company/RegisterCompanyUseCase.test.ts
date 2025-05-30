import { RegisterCompanyUseCase } from "../../../src/domain/usecases/Company/RegisterCompanyUseCase";
import { ICompanyRepository } from "../../../src/domain/repositories/ICompanyRepository";
import { Company } from "../../../src/domain/entities/Company";

jest.mock("../../../src/domain/repositories/ICompanyRepository");

const mockCompanyRepository: jest.Mocked<ICompanyRepository> = {
  createCompany: jest.fn(),
  updateCompany: jest.fn(),
  getCompany: jest.fn(),
  getAllCompany: jest.fn(),
};

describe("RegisterCompanyUseCase", () => {
  let registerCompanyUseCase: RegisterCompanyUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    registerCompanyUseCase = new RegisterCompanyUseCase(mockCompanyRepository);
  });

  describe("execute", () => {
    const validCompanyData = {
      name: "Test Company",
      phone: "123456789",
      address: "Test Address",
      email: "test@example.com",
      website: "https://example.com",
    };

    it("should register a company successfully", async () => {
      const mockCompany = new Company(
        "1",
        validCompanyData.name,
        validCompanyData.phone,
        validCompanyData.address,
        validCompanyData.email,
        validCompanyData.website
      );

      mockCompanyRepository.createCompany.mockResolvedValue(mockCompany);

      const result = await registerCompanyUseCase.execute(
        validCompanyData.name,
        validCompanyData.phone,
        validCompanyData.address,
        validCompanyData.email,
        validCompanyData.website
      );

      expect(mockCompanyRepository.createCompany).toHaveBeenCalledWith(
        expect.any(Company)
      );
      expect(result).toEqual({
        error: false,
        message: "Company registered successfully",
        data: mockCompany,
        statusCode: 201,
      });
    });

    it("should handle repository errors", async () => {
      const errorMessage = "Database connection failed";
      mockCompanyRepository.createCompany.mockRejectedValue(
        new Error(errorMessage)
      );

      const result = await registerCompanyUseCase.execute(
        validCompanyData.name,
        validCompanyData.phone,
        validCompanyData.address,
        validCompanyData.email,
        validCompanyData.website
      );

      expect(result).toEqual({
        error: true,
        message: errorMessage,
        data: null,
        statusCode: 500,
      });
    });

    it("should handle unknown errors", async () => {
      mockCompanyRepository.createCompany.mockRejectedValue("Non-Error throw");

      const result = await registerCompanyUseCase.execute(
        validCompanyData.name,
        validCompanyData.phone,
        validCompanyData.address,
        validCompanyData.email,
        validCompanyData.website
      );

      expect(result).toEqual({
        error: true,
        message: "An unknown error occurred",
        data: null,
        statusCode: 500,
      });
    });

    it("should return an error if required fields are missing", async () => {
      const result = await registerCompanyUseCase.execute(
        "",
        validCompanyData.phone,
        validCompanyData.address,
        validCompanyData.email,
        validCompanyData.website
      );

      expect(result).toEqual({
        error: true,
        message: "Name, phone, and email are required",
        data: null,
        statusCode: 400,
      });
    });

    it("should not call repository if validation fails", async () => {
      await registerCompanyUseCase.execute(
        "",
        "",
        validCompanyData.address,
        "",
        validCompanyData.website
      );

      expect(mockCompanyRepository.createCompany).not.toHaveBeenCalled();
    });

    it("should handle invalid email format", async () => {
      const result = await registerCompanyUseCase.execute(
        validCompanyData.name,
        validCompanyData.phone,
        validCompanyData.address,
        "invalid-email",
        validCompanyData.website
      );

      expect(result).toEqual({
        error: true,
        message: "Invalid email format",
        data: null,
        statusCode: 400,
      });
    });
  });
});
