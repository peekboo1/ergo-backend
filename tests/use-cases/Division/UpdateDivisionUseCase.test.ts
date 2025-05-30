import { UpdateDivisionUseCase } from "../../../src/domain/usecases/Division/UpdateDivisionUseCase";
import { IDivisionRepository } from "../../../src/domain/repositories/IDivisionRepository";
import { Division } from "../../../src/domain/entities/Division";

describe("UpdateDivisionUseCase", () => {
  let mockDivisionRepository: jest.Mocked<IDivisionRepository>;
  let updateDivisionUseCase: UpdateDivisionUseCase;

  beforeEach(() => {
    mockDivisionRepository = {
      readDivision: jest.fn(),
      updateDivision: jest.fn(),
    } as unknown as jest.Mocked<IDivisionRepository>;

    updateDivisionUseCase = new UpdateDivisionUseCase(mockDivisionRepository);
  });

  it("should update a division successfully", async () => {
    const existingDivision: Division = {
      id: "1",
      name: "Old Division",
      companyId: "123",
    };

    const updateData: Partial<Division> = {
      name: "Updated Division",
    };

    const updatedDivision: Division = {
      id: "1",
      name: "Updated Division",
      companyId: "123",
    };

    mockDivisionRepository.readDivision.mockResolvedValue(existingDivision);
    mockDivisionRepository.updateDivision.mockResolvedValue(updatedDivision);

    const result = await updateDivisionUseCase.execute("1", updateData);

    expect(mockDivisionRepository.readDivision).toHaveBeenCalledWith("1");
    expect(mockDivisionRepository.updateDivision).toHaveBeenCalledWith("1", {
      id: "1",
      name: "Updated Division",
      companyId: "123",
    });
    expect(result).toEqual(updatedDivision);
  });

  it("should throw an error if the division does not exist", async () => {
    mockDivisionRepository.readDivision.mockResolvedValue(null);

    await expect(
      updateDivisionUseCase.execute("1", { name: "Updated Division" })
    ).rejects.toThrow("Division not found");

    expect(mockDivisionRepository.readDivision).toHaveBeenCalledWith("1");
    expect(mockDivisionRepository.updateDivision).not.toHaveBeenCalled();
  });

  it("should throw an error if the update fails", async () => {
    const existingDivision: Division = {
      id: "1",
      name: "Old Division",
      companyId: "123",
    };

    const updateData: Partial<Division> = {
      name: "Updated Division",
    };

    mockDivisionRepository.readDivision.mockResolvedValue(existingDivision);
    mockDivisionRepository.updateDivision.mockResolvedValue(null);

    await expect(
      updateDivisionUseCase.execute("1", updateData)
    ).rejects.toThrow("Failed to update division");

    expect(mockDivisionRepository.readDivision).toHaveBeenCalledWith("1");
    expect(mockDivisionRepository.updateDivision).toHaveBeenCalledWith("1", {
      id: "1",
      name: "Updated Division",
      companyId: "123",
    });
  });

  it("should retain the original name if no name is provided in updateData", async () => {
    const existingDivision: Division = {
      id: "1",
      name: "Original Division",
      companyId: "123",
    };

    const updateData: Partial<Division> = {};

    const updatedDivision: Division = {
      id: "1",
      name: "Original Division",
      companyId: "123",
    };

    mockDivisionRepository.readDivision.mockResolvedValue(existingDivision);
    mockDivisionRepository.updateDivision.mockResolvedValue(updatedDivision);

    const result = await updateDivisionUseCase.execute("1", updateData);

    expect(mockDivisionRepository.readDivision).toHaveBeenCalledWith("1");
    expect(mockDivisionRepository.updateDivision).toHaveBeenCalledWith("1", {
      id: "1",
      name: "Original Division",
      companyId: "123",
    });
    expect(result).toEqual(updatedDivision);
  });
});
