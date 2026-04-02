/**
 * Lightweight request validation for API routes.
 * No external dependencies — uses simple runtime checks.
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

type SchemaField = {
  type: "string" | "number" | "boolean" | "object";
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: readonly string[];
};

type Schema = Record<string, SchemaField>;

/**
 * Validate a request body against a schema.
 * Returns the validated (and typed) body or throws ValidationError.
 */
export function validateBody<T extends Record<string, unknown>>(
  body: unknown,
  schema: Schema
): T {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Request body must be a JSON object");
  }

  const obj = body as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(schema)) {
    const value = obj[key];

    // Check required
    if (field.required && (value === undefined || value === null)) {
      throw new ValidationError(`Missing required field: ${key}`);
    }

    if (value === undefined || value === null) {
      continue;
    }

    // Type check
    if (typeof value !== field.type) {
      throw new ValidationError(
        `Field "${key}" must be ${field.type}, got ${typeof value}`
      );
    }

    // String validations
    if (field.type === "string" && typeof value === "string") {
      if (field.maxLength && value.length > field.maxLength) {
        throw new ValidationError(
          `Field "${key}" exceeds max length of ${field.maxLength}`
        );
      }
      if (field.minLength && value.length < field.minLength) {
        throw new ValidationError(
          `Field "${key}" must be at least ${field.minLength} characters`
        );
      }
      if (field.pattern && !field.pattern.test(value)) {
        throw new ValidationError(`Field "${key}" has invalid format`);
      }
      if (field.enum && !field.enum.includes(value)) {
        throw new ValidationError(
          `Field "${key}" must be one of: ${field.enum.join(", ")}`
        );
      }
    }

    // Number validations
    if (field.type === "number" && typeof value === "number") {
      if (!isFinite(value)) {
        throw new ValidationError(`Field "${key}" must be a finite number`);
      }
      if (field.min !== undefined && value < field.min) {
        throw new ValidationError(
          `Field "${key}" must be at least ${field.min}`
        );
      }
      if (field.max !== undefined && value > field.max) {
        throw new ValidationError(
          `Field "${key}" must be at most ${field.max}`
        );
      }
    }

    result[key] = value;
  }

  return result as T;
}

/**
 * Sanitize a string by trimming and removing control characters.
 */
export function sanitize(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
