import { IResponse } from "../../../shared/utils/IResponse";
import { superAdminToken } from "../../../shared/utils/SuperadminToken";
import { comparePassword } from "../../../shared/utils/PasswordUtils";
import { SuperadminModel } from "../../../infrastructure/db/models/SuperadminModel";

export class SuperAdminLoginUseCase {
  constructor() {}

  async execute(email: string, password: string): Promise<IResponse<any>> {
    try {
      let superadmin = await SuperadminModel.findOne({ where: { email } });

      if (!superadmin) {
        return {
          error: true,
          message: "Email not found",
          data: null,
        };
      }
      const isPasswordValid = await comparePassword(
        password,
        superadmin.password
      );
      if (!isPasswordValid) {
        return {
          error: true,
          message: "Invalid email or password",
          data: null,
        };
      }
      const token = superAdminToken(superadmin.id, superadmin.role);
      return {
        error: false,
        message: "Login successful",
        data: {
          id: superadmin.id,
          name: superadmin.name,
          email: superadmin.email,
          token,
        },
      };
    } catch (error) {
      return {
        error: true,
        message: "An error occurred",
        data: null,
      };
    }
  }
}
