import { IErgonomicAnalysisRepository } from "../../repositories/IErgonomicRepository";

export class GetErgonomicAnalysisBySupervisorUseCase {
  constructor(private repo: IErgonomicAnalysisRepository) {}

  async execute(supervisorId: string, month?: string) {
    const analyses = await this.repo.getAllErgonomicsHistoryBySupervisorId(
      supervisorId
    );

    const formatted = analyses.map((a) => ({
      ...a,
      createdAt: new Date(a.createdAt),
      updatedAt: new Date(a.updatedAt),
    }));

    if (month) {
      return formatted.filter((a) => {
        const itemMonth = (a.createdAt.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        return itemMonth === month;
      });
    }

    const grouped: Record<string, typeof formatted> = {};
    formatted.forEach((a) => {
      const monthKey = a.createdAt
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(a);
    });

    const orderedMonths = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const sortedGrouped: Record<string, typeof formatted> = {};
    for (const m of orderedMonths) {
      if (grouped[m]) {
        sortedGrouped[m] = grouped[m];
      }
    }

    return sortedGrouped;
  }
}
