import { Supervisor } from "../../../domain/entities/Supervisor";
import { SupervisorModel } from "../models/SupervisorModels";
import { ISupervisorRepository } from "../../../domain/repositories/ISupervisorRepository";

export class SupervisorRepository implements ISupervisorRepository {
  async isEmailExists(email: string): Promise<boolean> {
    try {
      const supervisor = await SupervisorModel.findOne({ where: { email } });
      return !!supervisor;
    } catch (error) {
      throw new Error("Error checking email existence");
    }
  }

  async createSupervisor(supervisor: Supervisor): Promise<Supervisor> {
    try {
      const newSupervisor = await SupervisorModel.create({
        name: supervisor.name,
        email: supervisor.email,
        password: supervisor.password,
        role: supervisor.role,
        companyId: supervisor.companyId,
      });

      return new Supervisor(
        newSupervisor.id,
        newSupervisor.name,
        newSupervisor.email,
        newSupervisor.password,
        newSupervisor.role,
        newSupervisor.companyId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
  }

  async updateSupervisor(
    id: string,
    supervisor: Partial<Supervisor>
  ): Promise<Supervisor> {
    try {
      const updatedSupervisor = await SupervisorModel.update(
        {
          name: supervisor.name,
          email: supervisor.email,
          password: supervisor.password,
          role: supervisor.role,
          companyId: supervisor.companyId,
        },
        { where: { id } }
      );

      if (updatedSupervisor[0] === 0) {
        throw new Error("Employee not found");
      }

      const supervisorData = await SupervisorModel.findOne({ where: { id } });

      if (!supervisorData) {
        throw new Error("Employee not found after update");
      }

      return new Supervisor(
        supervisorData.id,
        supervisorData.name,
        supervisorData.email,
        supervisorData.password
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
  }

  async deleteSupervisor(id: string): Promise<void> {
    const result = await SupervisorModel.destroy({ where: { id } });

    if (result === 0) {
      throw new Error("Supervisor not found");
    }
  }

  async getSupervisor(id: string): Promise<Supervisor | null> {
    const result = await SupervisorModel.findOne({ where: { id } });
    if (!result) return null;

    return new Supervisor(
      result.id,
      result.name,
      result.email,
      result.password,
      result.role,
      result.companyId
    );
  }

  async getAllSupervisors(): Promise<Supervisor[]> {
    const supervisors = await SupervisorModel.findAll();

    return supervisors.map(
      (supervisor) =>
        new Supervisor(
          supervisor.id,
          supervisor.name,
          supervisor.email,
          supervisor.password,
          supervisor.role,
          supervisor.companyId
        )
    );
  }
}
