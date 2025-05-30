import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ErgonomicVideoModel extends Model {
  public id!: string;
  public userId!: string;
  public fileUrl!: string;
  public skorBahuRula!: number;
  public skorLeherReba!: number;
  public skorLututReba!: number;
  public skorPergelanganRula!: number;
  public skorSikuReba!: number;
  public skorSikuRula!: number;
  public skorTrunkReba!: number;
  public skorSudutBahu!: number;
  public skorSudutLeher!: number;
  public skorSudutLutut!: number;
  public skorSudutPahaPunggung!: number;
  public sudutPergelangan!: number;
  public sudutSiku!: number;
  public sudutSikuRula!: number;
  public totalReba!: number;
  public totalRula!: number;
  public feedback!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ErgonomicVideoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skorBahuRula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorLeherReba: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorLututReba: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorPergelanganRula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorSikuReba: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorSikuRula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorTrunkReba: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skorSudutBahu: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    skorSudutLeher: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    skorSudutLutut: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    skorSudutPahaPunggung: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sudutPergelangan: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sudutSiku: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sudutSikuRula: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalReba: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalRula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "ergonomicvideo",
  }
);
