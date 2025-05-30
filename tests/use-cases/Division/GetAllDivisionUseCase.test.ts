import { GetAllDivisionUseCase } from "../../../src/domain/usecases/Division/GetAllDivisionUseCase";
import { IDivisionRepository } from "../../../src/domain/repositories/IDivisionRepository";

describe("GetAllDivisionUseCase", () => {
  let mockDivisionRepository: jest.Mocked<IDivisionRepository>;
  let getAllDivisionUseCase: GetAllDivisionUseCase;

  beforeEach(() => {
    mockDivisionRepository = {
      getAllDivision: jest.fn(),
      createDivision: jest.fn(),
      readDivision: jest.fn(),
      updateDivision: jest.fn(),
      deleteDivision: jest.fn(),
      getDivision: jest.fn(),
    };
    getAllDivisionUseCase = new GetAllDivisionUseCase(mockDivisionRepository);
  });

  it("should return a list of divisions with id and name", async () => {
    const companyId = "123";
    const mockDivisions = [
      { id: "1", name: "Division A", companyId: "123" },
      { id: "2", name: "Division B", companyId: "123" },
    ];
    mockDivisionRepository.getAllDivision.mockResolvedValue(mockDivisions);

    const result = await getAllDivisionUseCase.execute(companyId);

    expect(mockDivisionRepository.getAllDivision).toHaveBeenCalledWith(
      companyId
    );
    expect(result).toEqual([
      { id: "1", name: "Division A" },
      { id: "2", name: "Division B" },
    ]);
  });

  it("should throw 404 error if no divisions are found", async () => {
    const companyId = "123";
    mockDivisionRepository.getAllDivision.mockResolvedValue([]);

    await expect(getAllDivisionUseCase.execute(companyId)).rejects.toThrow(
      "Division not found"
    );
  });

  it("should throw an error if the repository throws an error", async () => {
    const companyId = "123";
    mockDivisionRepository.getAllDivision.mockRejectedValue(
      new Error("Repository error")
    );

    await expect(getAllDivisionUseCase.execute(companyId)).rejects.toThrow(
      "Repository error"
    );
    expect(mockDivisionRepository.getAllDivision).toHaveBeenCalledWith(
      companyId
    );
  });
});
