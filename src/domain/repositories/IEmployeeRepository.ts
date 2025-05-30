import { Employee } from "../entities/Employee";

export interface IEmployeeRepository {
  isEmailExists(email: string): Promise<boolean>;
  registerEmployee(user: Employee): Promise<Employee>;
  updateEmployee(id: string, user: Employee | Partial<Employee>): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  getEmployee(id: string): Promise<Employee | null>;
  getAllBySupervisorId(supervisorId: string): Promise<Employee[]>;
  getAllEmployee(): Promise<Employee[]>;
}
