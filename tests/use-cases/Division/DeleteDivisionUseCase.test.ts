import { DeleteDivisionUseCase } from "../../../src/domain/usecases/Division/DeleteDivisionUseCase";
import { IDivisionRepository } from "../../../src/domain/repositories/IDivisionRepository";

describe("DeleteDivisionUseCase", () => {
  let deleteDivisionUseCase: DeleteDivisionUseCase;
  let divisionRepository: jest.Mocked<IDivisionRepository>;

  beforeEach(() => {
    divisionRepository = {
      getDivision: jest.fn(),
      deleteDivision: jest.fn(),
      createDivision: jest.fn(),
      readDivision: jest.fn(),
      getAllDivision: jest.fn(),
      updateDivision: jest.fn(),
    } as jest.Mocked<IDivisionRepository>;

    deleteDivisionUseCase = new DeleteDivisionUseCase(divisionRepository);
  });

  it("should delete a division if it exists", async () => {
    const divisionId = "123";
    divisionRepository.getDivision.mockResolvedValue({
      id: divisionId,
      name: "Test Division",
      companyId: "Test Company",
    });

    await deleteDivisionUseCase.execute(divisionId);

    expect(divisionRepository.getDivision).toHaveBeenCalledWith(divisionId);
    expect(divisionRepository.deleteDivision).toHaveBeenCalledWith(divisionId);
  });

  it("should throw an error if the division does not exist", async () => {
    const divisionId = "123";
    divisionRepository.getDivision.mockResolvedValue(null);

    await expect(deleteDivisionUseCase.execute(divisionId)).rejects.toThrow(
      "Division not found"
    );

    expect(divisionRepository.getDivision).toHaveBeenCalledWith(divisionId);
    expect(divisionRepository.deleteDivision).not.toHaveBeenCalled();
  });
});
