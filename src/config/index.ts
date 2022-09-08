import { config } from "dotenv";
config();

export const {
  NODE_ENV,
  PORT,
  POSTGRESQL_USER,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_PORT,
  DATABASE_URL,
} = process.env;
