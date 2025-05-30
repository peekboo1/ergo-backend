import { IQuestionRepository } from "../../../domain/repositories/IQuestionRepository";
import { QuestionModel } from "../models/QuestionModels";
import { OptionModel } from "../models/OptionModels";
import { Question } from "../../../domain/entities/Question";
import { QuizAttemptModel } from "../models/QuizAttemptModels";

export class QuestionRepository implements IQuestionRepository {
  async addQuestion(quizId: string, question: string): Promise<Question> {
    try {
      const created = await QuestionModel.create({ quizId, question });
      return new Question(created.id, created.question, created.quizId);
    } catch (error) {
      throw new Error("Failed to create question");
    }
  }

  async updateQuestion(
    id: string,
    question: Partial<Question>
  ): Promise<Question> {
    try {
      await QuestionModel.update(question, { where: { id } });
      const updatedQuestion = await QuestionModel.findByPk(id);
      if (!updatedQuestion) throw new Error("Question not found");

      return new Question(
        updatedQuestion.id,
        updatedQuestion.question,
        updatedQuestion.quizId
      );
    } catch (error) {
      throw new Error("Failed to update question");
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    try {
      const deletedQuestion = await QuestionModel.destroy({ where: { id } });
      if (deletedQuestion === 0) throw new Error("Question not found");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete question";
      throw new Error(message);
    }
  }

  async getQuestionsByQuizId(quizId: string): Promise<any[]> {
    try {
      return await QuestionModel.findAll({
        where: { quizId },
        attributes: ["question", "quizId"],
        include: [
          {
            model: OptionModel,
            as: "options",
            attributes: ["id", "text", "isCorrect"],
          },
        ],
      });
    } catch (error) {
      throw new Error("Failed to retrieve questions");
    }
  }

  async getQuestionById(id: string): Promise<Question | null> {
    try {
      const question = await QuestionModel.findByPk(id);
      if (!question) return null;

      return new Question(question.id, question.question, question.quizId);
    } catch (error) {
      throw new Error("Failed to retrieve question");
    }
  }

  async getQuestionCountByAttempt(attemptId: string): Promise<number> {
    const attempt = await QuizAttemptModel.findByPk(attemptId);
    const questionCount = await QuestionModel.count({
      where: { quizId: attempt?.quizId },
    });
    return questionCount;
  }
}
