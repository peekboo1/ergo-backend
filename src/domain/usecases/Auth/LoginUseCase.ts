import { IUserRepository } from "../../repositories/IUserRepository";
import { ISupervisorRepository } from "../../repositories/ISupervisorRepository";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import { UserModel } from "../../../infrastructure/db/models/UserModels";
import { SupervisorModel } from "../../../infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../infrastructure/db/models/EmployeeModels";
import { createToken } from "../../../shared/utils/JwtUtils";
import { comparePassword } from "../../../shared/utils/PasswordUtils";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private supervisorRepository: ISupervisorRepository,
    private employeeRepository: IEmployeeRepository
  ) {}

  async execute(email: string, password: string): Promise<IResponse<any>> {
    try {
      let user = await UserModel.findOne({ where: { email } });
      let supervisor = await SupervisorModel.findOne({ where: { email } });
      let employee = await EmployeeModel.findOne({ where: { email } });

      if (!user && !supervisor && !employee) {
        return {
          error: true,
          message: "Email not found",
          data: null,
        };
      }

      let targetUser;
      if (user) {
        targetUser = user;
      } else if (supervisor) {
        targetUser = supervisor;
      } else if (employee) {
        targetUser = employee;
      }

      if (!targetUser) {
        return {
          error: true,
          message: "User not found",
          data: null,
        };
      }

      const isPasswordValid = await comparePassword(
        password,
        targetUser.password
      );
      if (!isPasswordValid) {
        return {
          error: true,
          message: "Invalid email or password",
          data: null,
        };
      }

      let supervisorId = null;
      let companyId = null;

      if (supervisor) {
        supervisorId = supervisor.id;
        companyId = supervisor.companyId;
      }

      const token = createToken(targetUser.id, targetUser.role, companyId);

      return {
        error: false,
        message: "Login successful",
        data: {
          token,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          error: true,
          message: error.message || "An error occurred during login",
          data: null,
        };
      } else {
        return {
          error: true,
          message: "An unknown error occurred",
          data: null,
        };
      }
    }
  }
}
