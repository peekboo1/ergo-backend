import { Employee } from "../../../domain/entities/Employee";
import { CompanyModel } from "../models/CompanyModels";
import { EmployeeModel } from "../models/EmployeeModels";
import { DivisionModel } from "../models/DivisionModels";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";

export class EmployeeRepository implements IEmployeeRepository {
  async isEmailExists(email: string): Promise<boolean> {
    const employee = await EmployeeModel.findOne({ where: { email } });
    return !!employee;
  }

  async registerEmployee(employee: Employee): Promise<Employee> {
    const newEmployee = await EmployeeModel.create({
      name: employee.name,
      email: employee.email,
      password: employee.password,
      role: employee.role,
      companyId: employee.companyId,
      divisionId: employee.divisionId,
      supervisorId: employee.supervisorId,
    });

    return new Employee(
      newEmployee.id,
      newEmployee.name,
      newEmployee.email,
      newEmployee.password,
      newEmployee.role,
      newEmployee.companyId,
      newEmployee.divisionId,
      newEmployee.supervisorId
    );
  }

  async updateEmployee(id: string, data: Employee): Promise<Employee> {
    const [updated] = await EmployeeModel.update(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        companyId: data.companyId,
        divisionId: data.divisionId,
        supervisorId: data.supervisorId,
      },
      { where: { id } }
    );

    if (updated === 0) throw new Error("Employee not found");

    const employee = await EmployeeModel.findOne({ where: { id } });
    if (!employee) throw new Error("Employee not found after update");

    return new Employee(
      employee.id,
      employee.name,
      employee.email,
      employee.password,
      employee.role,
      employee.companyId,
      employee.divisionId,
      employee.supervisorId
    );
  }

  async deleteEmployee(id: string): Promise<void> {
    const deleted = await EmployeeModel.destroy({ where: { id } });
    if (deleted === 0) throw new Error("Employee not found");
  }

  async getEmployee(id: string): Promise<Employee | null> {
    try {
      const employee = await EmployeeModel.findOne({ where: { id } });
      if (!employee) return null;

      return new Employee(
        employee.id,
        employee.name,
        employee.email,
        employee.password,
        employee.role,
        employee.companyId,
        employee.divisionId,
        employee.supervisorId
      );
    } catch {
      throw new Error("Error fetching employee by id");
    }
  }

  async getAllEmployee(): Promise<Employee[]> {
    const employees = await EmployeeModel.findAll({
      include: [
        { model: DivisionModel, attributes: ["name"] },
        { model: CompanyModel, as: "company", attributes: ["name"] },
      ],
    });

    return employees.map(
      (emp) =>
        new Employee(
          emp.id,
          emp.name,
          emp.email,
          emp.password,
          emp.role,
          emp.companyId,
          emp.divisionId,
          emp.supervisorId,
          (emp as any).DivisionModel?.name,
          (emp as any).company?.name
        )
    );
  }

  async getAllBySupervisorId(supervisorId: string): Promise<Employee[]> {
    const employees = await EmployeeModel.findAll({
      where: { supervisorId },
      include: [
        { model: DivisionModel, attributes: ["name"] },
        { model: CompanyModel, as: "company", attributes: ["name"] },
      ],
    });

    return employees.map(
      (emp) =>
        new Employee(
          emp.id,
          emp.name,
          emp.email,
          emp.password,
          emp.role,
          emp.companyId,
          emp.divisionId,
          emp.supervisorId,
          (emp as any).DivisionModel?.name,
          (emp as any).company?.name
        )
    );
  }
}
