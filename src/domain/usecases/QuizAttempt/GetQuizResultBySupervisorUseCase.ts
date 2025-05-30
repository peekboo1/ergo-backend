import { IQuizAttemptRepository } from "../../repositories/IQuizAttemptRepository";

export class GetQuizResultBySupervisorUseCase {
  constructor(private repo: IQuizAttemptRepository) {}

  async execute(supervisorId: string, month?: string) {
    const analyses = await this.repo.getAllBySupervisorId(supervisorId);

    const formattedAnalyses = analyses.map((a) => ({
      id: a.id,
      quizId: a.quizId,
      userId: a.userId,
      quizName: a.quizName,
      employeeName: a.name,
      score: a.score,
      createdAt: a.createdAt,
    }));

    if (month) {
      const filtered = formattedAnalyses.filter((a) => {
        const itemMonth = (a.createdAt.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        return itemMonth === month;
      });

      return filtered;
    } else {
      const groupedByMonth: { [key: string]: any[] } = {};

      formattedAnalyses.forEach((a) => {
        const date = a.createdAt;
        const monthName = date
          .toLocaleString("en-US", { month: "long" })
          .toLowerCase();

        if (!groupedByMonth[monthName]) {
          groupedByMonth[monthName] = [];
        }
        groupedByMonth[monthName].push(a);
      });

      const monthOrder = [
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

      const sortedGrouped: { [key: string]: any[] } = {};
      for (const m of monthOrder) {
        if (groupedByMonth[m]) {
          sortedGrouped[m] = groupedByMonth[m];
        }
      }

      return sortedGrouped;
    }
  }
}
