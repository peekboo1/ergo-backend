import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

const result = dotenv.config({
  path: path.resolve(__dirname, `../../${envFile}`),
});

if (result.error) {
  throw result.error;
}
