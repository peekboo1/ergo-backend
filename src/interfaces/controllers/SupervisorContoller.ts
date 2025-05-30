import sendResponse from "../../shared/utils/ResponseHelper";
import { Request, Response } from "express";
import { GetSupervisorUseCase } from "../../domain/usecases/Supervisor/GetSupervisorUseCase";
import { SupervisorRepository } from "../../infrastructure/db/repositories/SupervisorRepository";
import { UpdateSupervisorUseCase } from "../../domain/usecases/Supervisor/UpdateSupervisorUseCase";
import { DeleteSupervisorUseCase } from "../../domain/usecases/Supervisor/DeleteSupervisorUseCase";
import { RegisterSupervisorUseCase } from "../../domain/usecases/Supervisor/RegisterSupervisorUseCase";
import { GetAllSupervisorUseCase } from "../../domain/usecases/Supervisor/GetAllSupervisorUseCase";

const supervisorRepository = new SupervisorRepository();

export class SupervisorController {
  static async registerSupervisor(req: Request, res: Response) {
    try {
      const { name, email, password, companyId } = req.body;
      const registerSupervisorUseCase = new RegisterSupervisorUseCase(
        supervisorRepository
      );
      const user = await registerSupervisorUseCase.execute(
        name,
        email,
        password,
        companyId
      );

      if (user.error) {
        return sendResponse(res, 401, user.message);
      }

      sendResponse(res, 200, "Register Successfull", user.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static async updateSupervisor(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { name, email, password } = req.body;

      const updateSupervisorUseCase = new UpdateSupervisorUseCase(
        supervisorRepository
      );
      const updatedSupervisor = await updateSupervisorUseCase.execute(id, {
        name,
        email,
        password,
      });

      sendResponse(res, 200, "Supervisor updated", updatedSupervisor);
    } catch (error: any) {
      const message = error.message || "Unknown error";
      const status = error.statusCode || 400;
      return sendResponse(res, status, message);
    }
  }

  static async deleteSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteSupervisorUseCase = new DeleteSupervisorUseCase(
        supervisorRepository
      );
      await deleteSupervisorUseCase.execute(id);

      sendResponse(res, 200, "Supervisor deleted successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      sendResponse(res, 400, message);
    }
  }

  static async getSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const useCase = new GetSupervisorUseCase(supervisorRepository);
      const supervisor = await useCase.execute(id);

      sendResponse(res, 200, "Supervisor found", supervisor);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, message);
    }
  }

  static async getAllSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const getAllSupervisorUseCase = new GetAllSupervisorUseCase(
        supervisorRepository
      );
      const result = await getAllSupervisorUseCase.execute();

      sendResponse(res, 200, "Supervisors retrieved successfully", result);
    } catch (error: any) {
      const message = error.message || "Unknown error";
      const status = error.statusCode || 400;
      return sendResponse(res, status, message);
    }
  }
}
