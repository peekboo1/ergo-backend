import { Request, Response } from "express";
import { EmployeeRepository } from "../../infrastructure/db/repositories/EmployeeRepository";
import { RegisterEmployeeUseCase } from "../../domain/usecases/Employee/RegisterEmployeeUseCase";
import { UpdateEmployeeUseCase } from "../../domain/usecases/Employee/UpdateEmployeeUseCase";
import { GetEmployeeUseCase } from "../../domain/usecases/Employee/GetEmployeeUseCase";
import { DeleteEmployeeUseCase } from "../../domain/usecases/Employee/DeleteEmployeeUseCase";
import { GetEmployeeBySupervisorIdUseCase } from "../../domain/usecases/Employee/GetEmployeeBySupervisorId";
import { GetAllEmployeeUseCase } from "../../domain/usecases/Employee/GetAllEmployeeUseCase";
import sendResponse from "../../shared/utils/ResponseHelper";

const employeeRepository = new EmployeeRepository();

export class EmployeeController {
  static async registerEmployee(req: Request, res: Response) {
    try {
      const { name, email, password, divisionId } = req.body;
      const supervisorId = res.locals.supervisorId;
      const companyId = res.locals.companyId;

      if (!supervisorId || !companyId) {
        return sendResponse(res, 400, "Supervisor ID or Company ID is missing");
      }

      const regitsterEmployeeUseCase = new RegisterEmployeeUseCase(
        employeeRepository
      );
      const result = await regitsterEmployeeUseCase.execute(
        name,
        email,
        password,
        companyId,
        divisionId,
        supervisorId
      );

      if (result.error) {
        return sendResponse(res, 401, result.message);
      }

      return sendResponse(
        res,
        200,
        "Employee registered successfully",
        result.data
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const updateUseCase = new UpdateEmployeeUseCase(employeeRepository);
      const updated = await updateUseCase.execute(id, {
        name,
        email,
        password,
      });

      sendResponse(res, 200, "Employee updated successfully", updated);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      sendResponse(res, 400, message);
    }
  }

  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteUseCase = new DeleteEmployeeUseCase(employeeRepository);
      await deleteUseCase.execute(id);

      sendResponse(res, 200, "Employee deleted successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      sendResponse(res, 400, message);
    }
  }

  static async getEmployee(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const useCase = new GetEmployeeUseCase(employeeRepository);
      const result = await useCase.execute(id);

      sendResponse(res, 200, "Employee found", result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static async getAllEmployee(req: Request, res: Response) {
    try {
      const useCase = new GetAllEmployeeUseCase(employeeRepository);
      const result = await useCase.execute();

      sendResponse(res, 200, "Employees retrieved successfully", {
        total: result.length,
        data: result,
      });
    } catch (error: any) {
      const message = error.message || "Unknown error";
      const status = error.statusCode || 400;
      return sendResponse(res, status, message);
    }
  }

  static async getAllEmployeeBySupervisorId(req: Request, res: Response) {
    try {
      const supervisorId = res.locals.userId;
      const useCase = new GetEmployeeBySupervisorIdUseCase(employeeRepository);
      const result = await useCase.execute(supervisorId);

      sendResponse(res, 200, "Employees retrieved successfully", {
        total: result.length,
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }
}
