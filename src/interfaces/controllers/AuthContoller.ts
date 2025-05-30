import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/db/repositories/UserRepository";
import { SupervisorRepository } from "../../infrastructure/db/repositories/SupervisorRepository";
import { EmployeeRepository } from "../../infrastructure/db/repositories/EmployeeRepository";
import { LoginUseCase } from "../../domain/usecases/Auth/LoginUseCase";
import { addTokenToBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import sendResponse from "../../shared/utils/ResponseHelper";
import { SuperAdminLoginUseCase } from "../../domain/usecases/Auth/SuperadminLoginUseCase";

const userRepository = new UserRepository();
const supervisorRepository = new SupervisorRepository();
const employeeRepository = new EmployeeRepository();

export class AuthController {
  static async superAdminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const useCase = new SuperAdminLoginUseCase();
      const response = await useCase.execute(email, password);

      if (response.error) {
        return sendResponse(res, 401, response.message);
      }

      sendResponse(res, 200, "Login successful", response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const useCase = new LoginUseCase(
        userRepository,
        supervisorRepository,
        employeeRepository
      );
      const response = await useCase.execute(email, password);

      if (response.error) {
        return sendResponse(res, 401, response.message);
      }

      sendResponse(res, 200, "Login successful", response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static logout(req: Request, res: Response) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return sendResponse(res, 403, "Token is missing, unable to log out");
      }

      addTokenToBlacklist(token);

      sendResponse(res, 200, "Logout successful", "User logged out");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }
}
