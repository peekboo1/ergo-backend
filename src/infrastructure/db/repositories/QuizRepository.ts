import { Quiz } from "../../../domain/entities/Quiz";
import { QuizModel } from "../models/QuizModels";
import { OptionModel } from "../models/OptionModels";
import { QuestionModel } from "../models/QuestionModels";
import { SupervisorModel } from "../models/SupervisorModels";
import { IQuizRepository } from "../../../domain/repositories/IQuizRepository";

export class QuizRepository implements IQuizRepository {
  async createQuiz(quiz: Quiz): Promise<Quiz> {
    const created = await QuizModel.create({
      title: quiz.title,
      supervisorId: quiz.supervisorId,
    });

    return new Quiz(created.id, created.title, created.supervisorId);
  }

  async updateQuiz(id: string, quiz: Partial<Quiz>): Promise<Quiz> {
    await QuizModel.update(quiz, { where: { id } });

    const updated = await QuizModel.findByPk(id);
    if (!updated) throw new Error("Quiz not found");

    return new Quiz(updated.id, updated.title, updated.supervisorId);
  }

  async deleteQuiz(id: string): Promise<void> {
    await QuizModel.destroy({ where: { id } });
  }

  async getQuestionsByQuizId(quizId: string) {
    return await QuestionModel.findAll({
      where: { quizId },
      attributes: ["id", "question", "quizId"],
      include: [
        {
          model: OptionModel,
          as: "options",
          attributes: ["id", "text", "isCorrect", "questionId"],
        },
      ],
    });
  }

  async getAllQuizBySupervisorId(supervisorId: string): Promise<any[]> {
    const quizzes = await QuizModel.findAll({
      where: { supervisorId },
      order: [["createdAt", "ASC"]],
    });

    const supervisor = await SupervisorModel.findByPk(supervisorId);
    const supervisorName = supervisor?.name ?? "Unknown";

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      author: supervisorName,
      createdAt: quiz.createdAt,
    }));
  }
}
