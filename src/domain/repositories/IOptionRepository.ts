import { Option } from "../entities/Option";

export interface IOptionRepository {
  addOptions(
    questionId: string,
    options: { text: string; isCorrect: boolean }[]
  ): Promise<Option[]>;
  getOptionsByQuestionId(questionId: string): Promise<Option[]>;
  getOptionById(id: string): Promise<Option | null>;
}
