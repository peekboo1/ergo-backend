// src/infrastructure/orm/models/UserAnswerModel.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { QuizAttemptModel } from "./QuizAttemptModels";
import { OptionModel } from "./OptionModels";
import { EmployeeModel } from "./EmployeeModels";

export class UserAnswerModel extends Model {
  public id!: string;
  public attemptId!: string;
  public userId!: string;
  public selectedOptionId!: string;
  public isCorrect?: boolean;
  public option?: OptionModel;
  public employee?: EmployeeModel;
  public user?: EmployeeModel;
}

UserAnswerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    attemptId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "attempt_id", // 👈 tambahkan ini
      references: {
        model: QuizAttemptModel,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id", // 👈 ini juga
      references: {
        model: EmployeeModel,
        key: "id",
      },
    },
    selectedOptionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "selected_option_id", // 👈 dan ini
      references: {
        model: OptionModel,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "user_answers",
  }
);
