import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { QuestionModel } from "./QuestionModels";

export class OptionModel extends Model {
  public id!: string;
  public text!: string;
  public isCorrect!: boolean;
  public questionId!: string;
  public question?: QuestionModel;
}

OptionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: QuestionModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "options",
  }
);
