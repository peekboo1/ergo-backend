import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class SuperadminModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

SuperadminModel.init(
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "superadmin",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "superadmins",
  }
);
