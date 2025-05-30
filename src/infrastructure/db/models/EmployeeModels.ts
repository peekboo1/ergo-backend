import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { SupervisorModel } from "./SupervisorModels"; // Import Supervisor model
import { CompanyModel } from "./CompanyModels"; // Import Company model
import { DivisionModel } from "./DivisionModels";

export class EmployeeModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "employee";
  public companyId!: string;
  public divisionId!: string; 
  public supervisorId!: string; 
}

EmployeeModel.init(
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
      type: DataTypes.ENUM("employee"),
      allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CompanyModel,
        key: "id",
      },
    },
    divisionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: DivisionModel,
        key: "id",
      },
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
    tableName: "employees",
  }
);
