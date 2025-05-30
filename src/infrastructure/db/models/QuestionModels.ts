import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { QuizModel } from "./QuizModels";

export class QuestionModel extends Model {
  public id!: string;
  public question!: string;
  public quizId!: string;
}

QuestionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: QuizModel,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "questions",
  }
);
