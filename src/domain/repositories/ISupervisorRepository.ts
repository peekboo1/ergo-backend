import { Supervisor } from "../entities/Supervisor";

export interface ISupervisorRepository {
  isEmailExists(email: string): Promise<boolean>;
  createSupervisor(user: Supervisor): Promise<Supervisor>;
  getSupervisor(id: string): Promise<Supervisor | null>;
  updateSupervisor(
    id: string,
    supervisor: Partial<Supervisor>
  ): Promise<Supervisor>;
  deleteSupervisor(id: string): Promise<void>;
  getAllSupervisors(): Promise<Supervisor[]>;
}
