import { IQuizAttemptRepository } from "../../../domain/repositories/IQuizAttemptRepository";
import { QuizAttempt } from "../../../domain/entities/QuizAttempt";
import { QuizAttemptModel } from "../models/QuizAttemptModels";
import { QuizModel } from "../models/QuizModels";
import { UserAnswerModel } from "../models/UserAnswerModels";
import { OptionModel } from "../models/OptionModels";
import { EmployeeModel } from "../models/EmployeeModels";

export class QuizAttemptRepository implements IQuizAttemptRepository {
  async startAttempt(userId: string, quizId: string): Promise<QuizAttempt> {
    const attempt = await QuizAttemptModel.create({ userId, quizId });
    return new QuizAttempt(attempt.id, attempt.quizId, attempt.userId);
  }

  async getAttemptsByUser(userId: string): Promise<QuizAttempt[]> {
    const attempts = await QuizAttemptModel.findAll({ where: { userId } });
    return attempts.map((a) => new QuizAttempt(a.id, a.quizId, a.userId));
  }

  async getHistoryByUser(userId: string): Promise<any[]> {
    const records = await QuizAttemptModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    // console.log();
    return records.map((r) => ({
      id: r.id,
      quizId: r.quizId,
      userId: r.userId,
      score: r.score,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      quizName: r.quiz?.title || "",
    }));
  }

  async getAttemptById(id: string): Promise<QuizAttempt | null> {
    const attempt = await QuizAttemptModel.findByPk(id);
    return attempt
      ? new QuizAttempt(attempt.id, attempt.quizId, attempt.userId)
      : null;
  }

  async getDetailedAttemptsByUser(userId: string): Promise<any[]> {
    const attempts = await QuizAttemptModel.findAll({
      where: { userId },
      include: [
        {
          model: QuizModel,
          as: "quiz",
          attributes: ["id", "title"],
        },
        {
          model: UserAnswerModel,
          as: "answers",
          include: [
            {
              model: OptionModel,
              as: "option",
              attributes: ["id", "text", "isCorrect"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return attempts;
  }

  async updateScore(attemptId: string, score: number): Promise<void> {
    await QuizAttemptModel.update({ score }, { where: { id: attemptId } });
  }

  async getAllAttempts(): Promise<QuizAttempt[]> {
    const attempts = await QuizAttemptModel.findAll();
    return attempts.map((a) => new QuizAttempt(a.id, a.quizId, a.userId));
  }

  async getAllBySupervisorId(supervisorId: string): Promise<any[]> {
    const employees = await EmployeeModel.findAll({
      where: { supervisorId },
      attributes: ["id", "name"],
    });

    const employeeMap = new Map<string, string>();
    employees.forEach((e) => {
      employeeMap.set(e.id, e.name);
    });

    const employeeIds = employees.map((e) => e.id);
    const records = await QuizAttemptModel.findAll({
      where: { userId: employeeIds },
      include: [
        {
          model: QuizModel,
          as: "quiz",
          attributes: ["title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      quizId: r.quizId,
      name: employeeMap.get(r.userId) || "",
      score: r.score,
      quizName: r.quiz?.title || "",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async getByQuizIdAndSupervisorId(
    quizId: string,
    supervisorId: string
  ): Promise<any[]> {
    const employees = await EmployeeModel.findAll({
      where: { supervisorId },
      attributes: ["id", "name"],
    });

    const employeeMap = new Map<string, string>();
    employees.forEach((e) => {
      employeeMap.set(e.id, e.name);
    });

    const employeeIds = employees.map((e) => e.id);

    const records = await QuizAttemptModel.findAll({
      where: {
        quizId,
        userId: employeeIds,
      },
      include: [
        {
          model: QuizModel,
          as: "quiz",
          attributes: ["title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return records.map((r) => ({
      id: r.id,
      quizId: r.quizId,
      userId: r.userId,
      name: employeeMap.get(r.userId) || "",
      score: r.score,
      quizName: r.quiz?.title || "",
    }));
  }
}
