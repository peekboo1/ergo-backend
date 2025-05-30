import sendResponse from "../../shared/utils/ResponseHelper";
import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/db/repositories/UserRepository";
import { GetUserUseCase } from "../../domain/usecases/User/GetUserUseCase";
import { UpdateUserUseCase } from "../../domain/usecases/User/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../domain/usecases/User/DeleteUserUseCase";
import { RegisterUserUseCase } from "../../domain/usecases/User/RegisterUserUseCase";
import { GetAllUserUseCase } from "../../domain/usecases/User/GetAllUserUseCase";

const userRepository = new UserRepository();

export class UserController {
  static async createPersonal(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const registerUserUseCase = new RegisterUserUseCase(userRepository);
      const result = await registerUserUseCase.execute(name, email, password);

      if (result.error) {
        return sendResponse(res, result.statusCode ?? 400, result.message);
      }

      return sendResponse(res, 201, result.message, result.data);
    } catch (error) {
      return sendResponse(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async updatePersonal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const updatePersonalUseCase = new UpdateUserUseCase(userRepository);
      const result = await updatePersonalUseCase.execute(id, {
        name,
        email,
        password,
      });

      return sendResponse(res, 200, "User updated successfully", result);
    } catch (error: any) {
      const message = error.message || "Unknown error";
      const status = error.statusCode || 400;
      return sendResponse(res, status, message);
    }
  }

  static async deletePersonal(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const deletePersonalUseCase = new DeleteUserUseCase(userRepository);
      const result = await deletePersonalUseCase.execute(userId);
      sendResponse(res, 200, "User deleted", result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      sendResponse(res, 400, message);
    }
  }

  static async getPersonal(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const getUserUseCase = new GetUserUseCase(userRepository);
      const result = await getUserUseCase.execute(userId);
      sendResponse(res, 200, "User found", result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message === "User not found" ? 404 : 400;
      sendResponse(res, status, message);
    }
  }

  static async getAllPersonal(req: Request, res: Response) {
    try {
      const getAllPersonalUseCase = new GetAllUserUseCase(userRepository);
      const result = await getAllPersonalUseCase.execute();
      sendResponse(res, 200, "Users retrieved successfully", result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message === "No users found" ? 404 : 400;
      sendResponse(res, status, message);
    }
  }
}
