import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class CompanyModel extends Model {
  public id!: string;
  public name!: string;
  public phone!: string;
  public address!: string;
  public email!: string;
  public website!: string;
}

CompanyModel.init(
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "companies",
  }
);
