import { Request, Response } from "express";
import { CompanyRepository } from "../../infrastructure/db/repositories/CompanyRepository";
import { UpdateCompanyUseCase } from "../../domain/usecases/Company/UpdateCompanyUseCase";
import { RegisterCompanyUseCase } from "../../domain/usecases/Company/RegisterCompanyUseCase";
import { GetAllCompanyUseCase } from "../../domain/usecases/Company/GetAllCompanyUseCase";
import sendResponse from "../../shared/utils/ResponseHelper";

const companyRepository = new CompanyRepository();

export class CompanyController {
  static async registerCompany(req: Request, res: Response) {
    try {
      const { name, phone, address, email, website } = req.body;
      const useCase = new RegisterCompanyUseCase(companyRepository);

      const result = await useCase.execute(
        name,
        phone,
        address,
        email,
        website
      );

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      console.error("[CompanyController] registerCompany error", error);
      return sendResponse(res, 500, message);
    }
  }

  static async updateCompany(req: Request, res: Response) {
    try {
      const companyId = req.params.companyId;
      const { name, email, phone, address, website } = req.body;

      const useCase = new UpdateCompanyUseCase(companyRepository);
      const result = await useCase.execute(companyId, {
        name,
        email,
        phone,
        address,
        website,
      });

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      console.error("[CompanyController] updateCompany error", error);
      return sendResponse(res, 500, message);
    }
  }

  static async getAllCompany(req: Request, res: Response) {
    try {
      const getAllCompanyUseCase = new GetAllCompanyUseCase(companyRepository);
      const result = await getAllCompanyUseCase.execute();

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("[CompanyController] getAllCompany error", error);
      return sendResponse(res, 500, errorMessage);
    }
  }
}
