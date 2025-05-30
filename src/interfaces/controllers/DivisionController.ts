import { Request, Response } from "express";
import { RegisterDivisionUseCase } from "../../domain/usecases/Division/RegisterDivisionUseCase";
import { GetAllDivisionUseCase } from "../../domain/usecases/Division/GetAllDivisionUseCase";
import { UpdateDivisionUseCase } from "../../domain/usecases/Division/UpdateDivisionUseCase";
import { DeleteDivisionUseCase } from "../../domain/usecases/Division/DeleteDivisionUseCase";
import { DivisionRepository } from "../../infrastructure/db/repositories/DivisionRepository";
import sendResponse from "../../shared/utils/ResponseHelper";

const divisionRepository = new DivisionRepository();

export class DivisionController {
  static async registerDivision(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const companyId = res.locals.companyId;

      const registerDivisionUseCase = new RegisterDivisionUseCase(
        divisionRepository
      );
      const result = await registerDivisionUseCase.execute(name, companyId);

      if (result.error) {
        return sendResponse(res, 400, result.message);
      }

      sendResponse(res, 200, "Register successful", result.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 500, message);
    }
  }

  static async updateDivision(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updateDivisionUseCase = new UpdateDivisionUseCase(
        divisionRepository
      );
      const result = await updateDivisionUseCase.execute(id, { name });

      return sendResponse(res, 200, "Division updated successfully", result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Update Division Error:", error);
      return sendResponse(res, 400, message);
    }
  }

  static async deleteDivision(req: Request, res: Response) {
    try {
      const divisionId = req.params.id;

      const deleteDivisionUseCase = new DeleteDivisionUseCase(
        divisionRepository
      );
      const result = await deleteDivisionUseCase.execute(divisionId);

      sendResponse(res, 200, "Division deleted", result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static async getAllDivision(req: Request, res: Response) {
    try {
      const companyId = res.locals.companyId;

      const getAllDivisionUseCase = new GetAllDivisionUseCase(
        divisionRepository
      );

      sendResponse(res, 200, "Divisions retrieved successfully", {
        divisions: await getAllDivisionUseCase.execute(companyId),
      });
    } catch (error: any) {
      const message = error.message || "Unknown error";
      const status = error.statusCode || 400;
      return sendResponse(res, status, message);
    }
  }
}
