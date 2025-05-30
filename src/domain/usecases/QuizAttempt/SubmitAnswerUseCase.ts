import { IUserAnswerRepository } from "../../repositories/IUserAnswerRepository";
import { UserAnswer } from "../../entities/UserAnswer";
import { IResponse } from "../../../shared/utils/IResponse";
import { CalculateScoreUseCase } from "./CalculateScoreUseCase";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IOptionRepository } from "../../repositories/IOptionRepository";

export class SubmitAnswerUseCase {
  constructor(
    private userAnswerRepository: IUserAnswerRepository,
    private calculateScoreUseCase: CalculateScoreUseCase,
    private questionRepository: IQuestionRepository,
    private optionRepository: IOptionRepository
  ) {}

  async execute(
    userId: string,
    attemptId: string,
    questionId: string,
    selectedOptionId: string
  ): Promise<IResponse<UserAnswer | { score: number }>> {
    if (!userId || !attemptId || !selectedOptionId || !questionId) {
      return {
        error: true,
        message: "All fields are required",
        data: null,
      };
    }

    try {
      const question = await this.questionRepository.getQuestionById(
        questionId
      );
      if (!question) {
        return {
          error: true,
          message: "Question not found",
          data: null,
          statusCode: 404,
        };
      }

      const option = await this.optionRepository.getOptionById(
        selectedOptionId
      );

      if (!option) {
        return {
          error: true,
          message: "Option not found",
          data: null,
          statusCode: 404,
        };
      }

      if (option.questionId !== questionId) {
        return {
          error: true,
          message: "Option does not belong to the specified question",
          data: null,
          statusCode: 400,
        };
      }

      const result = await this.userAnswerRepository.submitAnswer(
        userId,
        attemptId,
        selectedOptionId
      );

      const allAnswers = await this.userAnswerRepository.getAnswersByAttempt(
        attemptId
      );

      if (!allAnswers) {
        return {
          error: true,
          message: "Failed to fetch answers.",
          data: null,
        };
      }

      const totalQuestions =
        await this.questionRepository.getQuestionCountByAttempt(attemptId);

      if (allAnswers.length === totalQuestions) {
        const score = await this.calculateScoreUseCase.execute(attemptId);

        return {
          error: false,
          message: "Answer submitted and score calculated",
          data: { score },
        };
      }

      return {
        error: false,
        message: "Answer submitted successfully",
        data: result,
      };
    } catch (error) {
      return {
        error: true,
        message: error instanceof Error ? error.message : "An error occurred",
        data: null,
      };
    }
  }
}
