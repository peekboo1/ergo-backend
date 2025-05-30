import { UpdateCompanyUseCase } from "../../../src/domain/usecases/Company/UpdateCompanyUseCase";
import { ICompanyRepository } from "../../../src/domain/repositories/ICompanyRepository";
import { Company } from "../../../src/domain/entities/Company";

describe("UpdateCompanyUseCase", () => {
  let mockCompanyRepository: jest.Mocked<ICompanyRepository>;
  let updateCompanyUseCase: UpdateCompanyUseCase;

  beforeEach(() => {
    mockCompanyRepository = {
      createCompany: jest.fn(),
      updateCompany: jest.fn(),
      getCompany: jest.fn(),
      getAllCompany: jest.fn(),
    } as jest.Mocked<ICompanyRepository>;

    updateCompanyUseCase = new UpdateCompanyUseCase(mockCompanyRepository);
  });

  it("should return an error response if the company does not exist", async () => {
    mockCompanyRepository.getCompany.mockResolvedValue(null);

    const response = await updateCompanyUseCase.execute("non-existent-id", {
      name: "New Name",
    });

    expect(response).toEqual({
      data: null,
      error: true,
      message: "Company not found",
      statusCode: 404,
    });
    expect(mockCompanyRepository.getCompany).toHaveBeenCalledWith(
      "non-existent-id"
    );
  });

  it("should update the company and return a success response", async () => {
    const existingCompany: Company = {
      id: "1",
      name: "Old Name",
      email: "old@example.com",
      phone: "123456789",
      address: "Old Address",
      website: "oldwebsite.com",
    };

    const updatedCompany: Company = {
      ...existingCompany,
      name: "New Name",
    };

    mockCompanyRepository.getCompany.mockResolvedValue(existingCompany);
    mockCompanyRepository.updateCompany.mockResolvedValue(updatedCompany);

    const response = await updateCompanyUseCase.execute("1", {
      name: "New Name",
    });

    expect(response).toEqual({
      data: updatedCompany,
      error: false,
      message: "Company updated successfully",
      statusCode: 200,
    });
    expect(mockCompanyRepository.getCompany).toHaveBeenCalledWith("1");
    expect(mockCompanyRepository.updateCompany).toHaveBeenCalledWith("1", {
      name: "New Name",
      email: "old@example.com",
      phone: "123456789",
      address: "Old Address",
      website: "oldwebsite.com",
    });
  });

  it("should handle partial updates correctly", async () => {
    const existingCompany: Company = {
      id: "1",
      name: "Old Name",
      email: "old@example.com",
      phone: "123456789",
      address: "Old Address",
      website: "oldwebsite.com",
    };

    const updatedCompany: Company = {
      ...existingCompany,
      email: "new@example.com",
    };

    mockCompanyRepository.getCompany.mockResolvedValue(existingCompany);
    mockCompanyRepository.updateCompany.mockResolvedValue(updatedCompany);

    const response = await updateCompanyUseCase.execute("1", {
      email: "new@example.com",
    });

    expect(response).toEqual({
      data: updatedCompany,
      error: false,
      message: "Company updated successfully",
      statusCode: 200,
    });
    expect(mockCompanyRepository.getCompany).toHaveBeenCalledWith("1");
    expect(mockCompanyRepository.updateCompany).toHaveBeenCalledWith("1", {
      name: "Old Name",
      email: "new@example.com",
      phone: "123456789",
      address: "Old Address",
      website: "oldwebsite.com",
    });
  });

  it("should return an error response if an exception occurs", async () => {
    mockCompanyRepository.getCompany.mockRejectedValue(
      new Error("Database error")
    );

    const response = await updateCompanyUseCase.execute("1", {
      name: "New Name",
    });

    expect(response).toEqual({
      data: null,
      error: true,
      message: "Database error",
      statusCode: 500,
    });
    expect(mockCompanyRepository.getCompany).toHaveBeenCalledWith("1");
  });
});
