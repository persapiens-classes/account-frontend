import z from 'zod';

export const MAX_LENGTH = 40;

export function toModelFromHistory<T>(schema: z.ZodType<T>): T {
  return safeModelWithZod(history.state.model, schema);
}

export function safeModelWithZod<T>(data: unknown, schema: z.ZodType<T>): T {
  const validated = schema.safeParse(data);

  if (!validated.success) {
    console.error('Validation backend error:', validated.error);
    throw new Error(`Invalid data returned from the server: ${validated.error.message}`);
  }

  return validated.data;
}
