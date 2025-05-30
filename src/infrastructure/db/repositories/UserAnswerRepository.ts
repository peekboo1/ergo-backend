import { IUserAnswerRepository } from "../../../domain/repositories/IUserAnswerRepository";
import { UserAnswer } from "../../../domain/entities/UserAnswer";
import { UserAnswerModel } from "../models/UserAnswerModels";
import { OptionModel } from "../models/OptionModels";
import { QuestionModel } from "../models/QuestionModels";
import { EmployeeModel } from "../models/EmployeeModels";

export class UserAnswerRepository implements IUserAnswerRepository {
  async submitAnswer(
    userId: string,
    attemptId: string,
    selectedOptionId: string
  ): Promise<UserAnswer> {
    const existingAnswer = await UserAnswerModel.findOne({
      where: {
        attemptId,
        selectedOptionId,
        userId,
      },
    });

    if (existingAnswer) {
      throw new Error("You have already answered this question.");
    }

    const answer = await UserAnswerModel.create({
      userId,
      attemptId,
      selectedOptionId,
    });

    return new UserAnswer(
      answer.id,
      answer.userId,
      answer.attemptId,
      answer.selectedOptionId
    );
  }

  async getAnswersByAttemptId(attemptId: string): Promise<any[]> {
    const answers = await UserAnswerModel.findAll({
      where: { attemptId },
      attributes: ["id", "selectedOptionId", "userId"],
      include: [
        {
          model: OptionModel,
          as: "option",
          attributes: ["id", "text", "isCorrect", "questionId"],
          include: [
            {
              model: QuestionModel,
              as: "question",
              attributes: ["question"],
            },
          ],
        },
        {
          model: EmployeeModel,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    return answers.map((a) => {
      return {
        id: a.id,
        // userId: a.userId,
        employeeName: a.user?.name ?? null,
        // selectedOptionId: a.selectedOptionId,
        questionText: a.option?.question?.question ?? null,
        answerText: a.option?.text ?? null,
        isCorrect: a.option?.isCorrect ?? null,
      };
    });
  }

  async getAnswersByUserId(userId: string): Promise<UserAnswer[]> {
    const answers = await UserAnswerModel.findAll({ where: { userId } });
    return answers.map(
      (a) => new UserAnswer(a.id, a.userId, a.attemptId, a.selectedOptionId)
    );
  }

  async getAnswersByAttempt(attemptId: string): Promise<UserAnswer[]> {
    const answers = await UserAnswerModel.findAll({
      where: { attemptId },
      include: [
        {
          model: OptionModel,
          as: "option",
          attributes: ["isCorrect"],
        },
      ],
    });

    return answers.map((a) => {
      const isCorrect = a.option?.isCorrect ?? false;
      return new UserAnswer(
        a.id,
        a.attemptId,
        a.userId,
        a.selectedOptionId,
        isCorrect
      );
    });
  }
}
