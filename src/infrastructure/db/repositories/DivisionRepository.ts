import { Division } from "../../../domain/entities/Division";
import { DivisionModel } from "../models/DivisionModels";
import { IDivisionRepository } from "../../../domain/repositories/IDivisionRepository";

export class DivisionRepository implements IDivisionRepository {
  async createDivision(division: Division): Promise<Division> {
    const newDivision = await DivisionModel.create({
      name: division.name,
      companyId: division.companyId,
    });

    return new Division(
      newDivision.id,
      newDivision.name,
      newDivision.companyId
    );
  }

  async readDivision(id: string): Promise<Division | null> {
    try {
      const division = await DivisionModel.findOne({ where: { id } });
      if (!division) return null;

      return new Division(division.id, division.name, division.companyId);
    } catch (error) {
      throw new Error("Error fetching division by ID");
    }
  }

  async updateDivision(
    id: string,
    division: Partial<Division>
  ): Promise<Division> {
    try {
      const [affectedRows] = await DivisionModel.update(
        { name: division.name },
        { where: { id } }
      );

      if (affectedRows === 0) {
        throw new Error("Division not found");
      }

      const updatedDivision = await DivisionModel.findOne({ where: { id } });

      if (!updatedDivision) {
        throw new Error("Division not found after update");
      }

      return new Division(
        updatedDivision.id,
        updatedDivision.name,
        updatedDivision.companyId
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(message);
    }
  }

  async deleteDivision(id: string): Promise<void> {
    try {
      await DivisionModel.destroy({ where: { id } });
    } catch (error) {
      throw new Error("Error deleting division");
    }
  }

  async getDivision(id: string): Promise<Division | null> {
    const result = await DivisionModel.findOne({ where: { id } });
    if (!result) return null;

    return new Division(result.id, result.name, result.companyId);
  }

  async getAllDivision(companyId: string): Promise<Division[]> {
    try {
      const divisions = await DivisionModel.findAll({ where: { companyId } });
      return divisions.map((d) => new Division(d.id, d.name, d.companyId));
    } catch (error) {
      throw new Error("Error retrieving divisions");
    }
  }
}
