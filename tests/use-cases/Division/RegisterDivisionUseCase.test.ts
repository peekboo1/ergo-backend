import { RegisterDivisionUseCase } from "../../../src/domain/usecases/Division/RegisterDivisionUseCase";
import { IDivisionRepository } from "../../../src/domain/repositories/IDivisionRepository";
import { Division } from "../../../src/domain/entities/Division";

describe("RegisterDivisionUseCase", () => {
  let mockDivisionRepository: jest.Mocked<IDivisionRepository>;
  let registerDivisionUseCase: RegisterDivisionUseCase;

  beforeEach(() => {
    mockDivisionRepository = {
      createDivision: jest.fn(),
      readDivision: jest.fn(),
      getDivision: jest.fn(),
      getAllDivision: jest.fn(),
      updateDivision: jest.fn(),
      deleteDivision: jest.fn(),
    } as jest.Mocked<IDivisionRepository>;

    registerDivisionUseCase = new RegisterDivisionUseCase(
      mockDivisionRepository
    );
  });

  it("should return an error response if name is missing", async () => {
    const response = await registerDivisionUseCase.execute("", "companyId");

    expect(response).toEqual({
      error: true,
      message: "Name, and Company ID are required",
      statusCode: 400,
      data: null,
    });
  });

  it("should return an error response if companyId is missing", async () => {
    const response = await registerDivisionUseCase.execute("divisionName", "");

    expect(response).toEqual({
      error: true,
      message: "Name, and Company ID are required",
      statusCode: 400,
      data: null,
    });
  });

  it("should create a division and return a success response", async () => {
    const mockDivision = new Division("1", "divisionName", "companyId");
    mockDivisionRepository.createDivision.mockResolvedValue(mockDivision);

    const response = await registerDivisionUseCase.execute(
      "divisionName",
      "companyId"
    );

    expect(mockDivisionRepository.createDivision).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "divisionName",
        companyId: "companyId",
      })
    );
    expect(response).toEqual({
      error: false,
      message: "Company registered successfully",
      data: mockDivision,
      statusCode: 201,
    });
  });

  it("should throw an error if repository throws an error", async () => {
    mockDivisionRepository.createDivision.mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      registerDivisionUseCase.execute("divisionName", "companyId")
    ).rejects.toThrow("Registration failed: Database error");
  });
});
