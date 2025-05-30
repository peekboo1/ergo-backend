import { Option } from "../../../domain/entities/Option";
import { OptionModel } from "../models/OptionModels";
import { IOptionRepository } from "../../../domain/repositories/IOptionRepository";

export class OptionRepository implements IOptionRepository {
  async addOptions(
    questionId: string,
    options: { text: string; isCorrect: boolean }[]
  ): Promise<Option[]> {
    try {
      if (options.length !== 4) {
        throw new Error("Each question must have exactly 4 options.");
      }

      const createdOptions = await OptionModel.bulkCreate(
        options.map((option) => ({
          text: option.text,
          isCorrect: option.isCorrect,
          questionId,
        }))
      );

      return createdOptions.map(
        (opt) => new Option(opt.id, opt.text, opt.isCorrect, opt.questionId)
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add options";
      throw new Error(message);
    }
  }

  async getOptionsByQuestionId(questionId: string): Promise<Option[]> {
    try {
      const options = await OptionModel.findAll({
        where: { questionId },
        attributes: ["id", "text", "isCorrect", "questionId"],
      });

      return options.map(
        (opt) => new Option(opt.id, opt.text, opt.isCorrect, opt.questionId)
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve options";
      throw new Error(message);
    }
  }

  async getOptionById(id: string): Promise<Option | null> {
    try {
      const option = await OptionModel.findOne({ where: { id } });
      if (!option) return null;

      return new Option(
        option.id,
        option.text,
        option.isCorrect,
        option.questionId
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve option";
      throw new Error(message);
    }
  }
}
