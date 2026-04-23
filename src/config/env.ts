import "dotenv/config";

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.NODE_ENV === "migration"
      ? process.env.DIRECT_DATABASE_URL
      : process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "secret",
};

export default env;
