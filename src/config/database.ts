import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  String(process.env.DB_PASSWORD),
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: process.env.NODE_ENV === "test" ? false : console.log,
  }
);

export default sequelize;
