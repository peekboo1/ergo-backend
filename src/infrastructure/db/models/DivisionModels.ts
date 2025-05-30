import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import { CompanyModel } from "../../db/models/CompanyModels";

export class DivisionModel extends Model {
  public id!: string;
  public name!: string;
  public companyId!: string;
}

DivisionModel.init(
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
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CompanyModel,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "divisions",
  }
);
