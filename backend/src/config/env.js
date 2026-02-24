const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];

export const validateEnv = () => {
  const missingVars = REQUIRED_ENV_VARS.filter((name) => {
    const value = process.env[name];
    return !value || !value.trim();
  });

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
};
