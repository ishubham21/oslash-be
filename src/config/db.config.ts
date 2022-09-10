export const {
  POSTGRESQL_USER = "admin",
  POSTGRESQL_PASSWORD = "admin",
  POSTGRESQL_PORT = "5432",
  POSTGRESQL_HOST = "localhost",
} = process.env;

export const {
  DATABASE_URL = `postgres://${POSTGRESQL_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_HOST}:${POSTGRESQL_PORT}`,
} = process.env;
