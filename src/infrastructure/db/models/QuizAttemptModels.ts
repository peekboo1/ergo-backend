import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { QuizModel } from "./QuizModels";
import { EmployeeModel } from "./EmployeeModels";

export class QuizAttemptModel extends Model {
  public id!: string;
  public quizId!: string;
  public userId!: string;
  public score?: number;
  public quiz?: QuizModel;
  public createdAt!: Date;
  public updatedAt!: Date;
}

QuizAttemptModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: QuizModel,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: EmployeeModel,
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "quiz_attempts",
  }
);
