import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class UserModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "personal";
}

UserModel.init(
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
      type: DataTypes.ENUM("personal"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
