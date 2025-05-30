import { Ergonomic } from "../entities/Ergonomic";

export interface IErgonomicAnalysisRepository {
  uploadErgonomics(userId: string, fileUrl: string): Promise<Ergonomic>;
  getErgonomicsHistory(userId: string): Promise<any[]>;
  getAllErgonomicsHistoryBySupervisorId(supervisorId: string): Promise<any[]>;
}
