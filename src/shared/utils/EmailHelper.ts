import { UserModel } from "../../infrastructure/db/models/UserModels";
import { SupervisorModel } from "../../infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../infrastructure/db/models/EmployeeModels";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const existingUser = await UserModel.findOne({ where: { email } });
  const existingSupervisor = await SupervisorModel.findOne({
    where: { email },
  });
  const existingEmployee = await EmployeeModel.findOne({ where: { email } });

  return !!(existingUser || existingSupervisor || existingEmployee); // Returns true if any record is found
};
