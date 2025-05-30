import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { CompanyModel } from "./CompanyModels"; // Import Company model

export class SupervisorModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "supervisor";
  public companyId!: string; // Foreign key to Company
}

SupervisorModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("supervisor"),
      allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CompanyModel, // Reference to Company table
        key: "id", // Reference to Company's id
      },
    },
  },
  {
    sequelize,
    tableName: "supervisors",
  }
);
