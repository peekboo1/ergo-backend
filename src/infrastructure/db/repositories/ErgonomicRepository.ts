import { ErgonomicModel } from "../models/ErgonomicModels";
import { Ergonomic } from "../../../domain/entities/Ergonomic";
import { EmployeeModel } from "../models/EmployeeModels";
import { IErgonomicAnalysisRepository } from "../../../domain/repositories/IErgonomicRepository";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export class ErgonomicRepository implements IErgonomicAnalysisRepository {
  async uploadErgonomics(userId: string, filePath: string): Promise<Ergonomic> {
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    try {
      const { data } = await axios.post(
        "https://vps.danar.site/predict/image",
        form,
        {
          headers: form.getHeaders(),
        }
      );

      const result = data.result;

      const record = await ErgonomicModel.create({
        userId,
        fileUrl: result.gambar_path,
        skorBahuRula: result.skor_bahu_rula,
        skorLeherReba: result.skor_leher_reba,
        skorLututReba: result.skor_lutut_reba,
        skorPergelanganRula: result.skor_pergelangan_rula,
        skorSikuReba: result.skor_siku_reba,
        skorSikuRula: result.skor_siku_rula,
        skorTrunkReba: result.skor_trunk_reba,
        skorSudutBahu: result.sudut.sudut_bahu,
        skorSudutLeher: result.sudut.sudut_leher,
        skorSudutLutut: result.sudut.sudut_lutut,
        skorSudutPahaPunggung: result.sudut.sudut_paha_punggung,
        sudutPergelangan: result.sudut.sudut_pergelangan,
        sudutSiku: result.sudut.sudut_siku,
        sudutSikuRula: result.sudut.sudut_siku_rula,
        totalReba: result.total_reba,
        totalRula: result.total_rula,
        feedback: result.feedback,
      });

      return new Ergonomic(
        record.id,
        record.userId,
        record.fileUrl,
        record.skorBahuRula,
        record.skorLeherReba,
        record.skorLututReba,
        record.skorPergelanganRula,
        record.skorSikuReba,
        record.skorSikuRula,
        record.skorTrunkReba,
        record.skorSudutBahu,
        record.skorSudutLeher,
        record.skorSudutLutut,
        record.skorSudutPahaPunggung,
        record.sudutPergelangan,
        record.sudutSiku,
        record.sudutSikuRula,
        record.totalReba,
        record.totalRula,
        record.feedback,
        new Date(record.createdAt),
        new Date(record.updatedAt)
      );
    } catch (error) {
      console.error("Failed to call ML endpoint:", error);
      throw new Error("Failed to analyze image with ML model");
    }
  }

  async getErgonomicsHistory(userId: string): Promise<any[]> {
    const records = await ErgonomicModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return records.map((result) => ({
      fileUrl: result.fileUrl,
      skorBahuRula: result.skorBahuRula,
      skorLeherReba: result.skorLeherReba,
      skorLututReba: result.skorLututReba,
      skorPergelanganRula: result.skorPergelanganRula,
      skorSikuReba: result.skorSikuReba,
      skorSikuRula: result.skorSikuRula,
      skorTrunkReba: result.skorTrunkReba,
      skorSudutBahu: parseFloat(result.skorSudutBahu.toFixed(2)),
      skorSudutLeher: parseFloat(result.skorSudutLeher.toFixed(2)),
      skorSudutLutut: parseFloat(result.skorSudutLutut.toFixed(2)),
      skorSudutPahaPunggung: parseFloat(
        result.skorSudutPahaPunggung.toFixed(2)
      ),
      sudutPergelangan: parseFloat(result.sudutPergelangan.toFixed(2)),
      sudutSiku: parseFloat(result.sudutSiku.toFixed(2)),
      sudutSikuRula: parseFloat(result.sudutSikuRula.toFixed(2)),
      totalReba: result.totalReba,
      totalRula: result.totalRula,
      feedback: result.feedback,
    }));
  }

  async getAllErgonomicsHistoryBySupervisorId(
    supervisorId: string
  ): Promise<any[]> {
    const employees = await EmployeeModel.findAll({
      where: { supervisorId },
      attributes: ["id", "name"],
    });

    const employeeMap = new Map(employees.map((e) => [e.id, e.name]));
    const employeeIds = employees.map((e) => e.id);

    const records = await ErgonomicModel.findAll({
      where: { userId: employeeIds },
      order: [["createdAt", "DESC"]],
    });

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      name: employeeMap.get(r.userId) || "",
      fileUrl: r.fileUrl,
      skorLututReba: r.skorLututReba,
      skorSikuReba: r.skorSikuReba,
      skorLeherReba: r.skorLeherReba,
      skorTrunkReba: r.skorTrunkReba,
      skorPergelanganRula: r.skorPergelanganRula,
      skorBahuRula: r.skorBahuRula,
      skorSikuRula: r.skorSikuRula,
      totalReba: r.totalReba,
      totalRula: r.totalRula,
      feedback: r.feedback,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}
