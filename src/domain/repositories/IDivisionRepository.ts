import { Division } from "../entities/Division";

export interface IDivisionRepository {
  createDivision(Division: Division): Promise<Division>;
  readDivision(id: string): Promise<Division | null>;
  getDivision(id: string): Promise<Division | null>;
  getAllDivision(companyId: string): Promise<Division[]>;
  updateDivision(
    id: string,
    Division: Partial<Division>
  ): Promise<Division | null>;
  deleteDivision(id: string): Promise<void>;
}
