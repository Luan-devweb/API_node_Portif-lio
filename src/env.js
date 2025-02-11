import z from "zod";

const envSchema = z.object({
  PORT: z.string().transform((value) => Number(value)),
  MONGO_DB_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  MONGO_DB_PARAMS: z.string(),
});

export const env = envSchema.parse(process.env);
