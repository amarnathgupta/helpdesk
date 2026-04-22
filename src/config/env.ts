import "dotenv/config";

const env = {
  DATABASE_URL:
    process.env.NODE_ENV === "development"
      ? process.env.DIRECT_DATABASE_URL
      : process.env.DATABASE_URL,
};

export default env;
