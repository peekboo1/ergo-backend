import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { SupervisorModel } from "./SupervisorModels";

export class QuizModel extends Model {
  public id!: string;
  public title!: string;
  public supervisorId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supervisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SupervisorModel,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "quiz",
  }
);
