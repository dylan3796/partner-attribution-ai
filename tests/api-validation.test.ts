/**
 * API Input Validation Tests
 *
 * Tests the validation utility used by API routes to reject
 * malformed or malicious input.
 */

import { describe, it, expect } from "vitest";
import { validateBody, sanitize, ValidationError } from "../lib/api-validation";

describe("validateBody", () => {
  describe("Required fields", () => {
    it("throws when required field is missing", () => {
      expect(() =>
        validateBody({}, { name: { type: "string", required: true } })
      ).toThrow(ValidationError);
    });

    it("throws when required field is null", () => {
      expect(() =>
        validateBody(
          { name: null },
          { name: { type: "string", required: true } }
        )
      ).toThrow("Missing required field: name");
    });

    it("passes when required field is present", () => {
      const result = validateBody(
        { name: "test" },
        { name: { type: "string", required: true } }
      );
      expect(result).toEqual({ name: "test" });
    });

    it("allows missing optional fields", () => {
      const result = validateBody(
        {},
        { name: { type: "string", required: false } }
      );
      expect(result).toEqual({});
    });
  });

  describe("Type checking", () => {
    it("rejects wrong type (string expected, number given)", () => {
      expect(() =>
        validateBody({ name: 123 }, { name: { type: "string", required: true } })
      ).toThrow('Field "name" must be string, got number');
    });

    it("rejects wrong type (number expected, string given)", () => {
      expect(() =>
        validateBody(
          { amount: "100" },
          { amount: { type: "number", required: true } }
        )
      ).toThrow('Field "amount" must be number, got string');
    });

    it("accepts correct types", () => {
      const result = validateBody(
        { name: "test", count: 5, active: true },
        {
          name: { type: "string", required: true },
          count: { type: "number", required: true },
          active: { type: "boolean", required: true },
        }
      );
      expect(result).toEqual({ name: "test", count: 5, active: true });
    });
  });

  describe("String validations", () => {
    it("rejects strings exceeding maxLength", () => {
      expect(() =>
        validateBody(
          { name: "a".repeat(300) },
          { name: { type: "string", required: true, maxLength: 255 } }
        )
      ).toThrow("exceeds max length");
    });

    it("rejects strings below minLength", () => {
      expect(() =>
        validateBody(
          { name: "" },
          { name: { type: "string", required: true, minLength: 1 } }
        )
      ).toThrow("must be at least 1 characters");
    });

    it("rejects strings not matching pattern", () => {
      expect(() =>
        validateBody(
          { email: "not-an-email" },
          {
            email: {
              type: "string",
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
          }
        )
      ).toThrow("invalid format");
    });

    it("rejects strings not in enum", () => {
      expect(() =>
        validateBody(
          { plan: "ultra" },
          {
            plan: {
              type: "string",
              required: true,
              enum: ["pro", "scale"] as const,
            },
          }
        )
      ).toThrow("must be one of: pro, scale");
    });
  });

  describe("Number validations", () => {
    it("rejects NaN", () => {
      expect(() =>
        validateBody(
          { amount: NaN },
          { amount: { type: "number", required: true } }
        )
      ).toThrow("must be a finite number");
    });

    it("rejects Infinity", () => {
      expect(() =>
        validateBody(
          { amount: Infinity },
          { amount: { type: "number", required: true } }
        )
      ).toThrow("must be a finite number");
    });

    it("rejects numbers below min", () => {
      expect(() =>
        validateBody(
          { amount: -1 },
          { amount: { type: "number", required: true, min: 0 } }
        )
      ).toThrow("must be at least 0");
    });

    it("rejects numbers above max", () => {
      expect(() =>
        validateBody(
          { amount: 200 },
          { amount: { type: "number", required: true, max: 100 } }
        )
      ).toThrow("must be at most 100");
    });
  });

  describe("Non-object bodies", () => {
    it("rejects null body", () => {
      expect(() => validateBody(null, {})).toThrow(
        "Request body must be a JSON object"
      );
    });

    it("rejects array body", () => {
      expect(() => validateBody([1, 2, 3], {})).toThrow(
        "Request body must be a JSON object"
      );
    });

    it("rejects string body", () => {
      expect(() => validateBody("hello", {})).toThrow(
        "Request body must be a JSON object"
      );
    });
  });
});

describe("sanitize", () => {
  it("trims whitespace", () => {
    expect(sanitize("  hello  ")).toBe("hello");
  });

  it("removes null bytes", () => {
    expect(sanitize("hello\x00world")).toBe("helloworld");
  });

  it("removes control characters", () => {
    expect(sanitize("hello\x01\x02\x03world")).toBe("helloworld");
  });

  it("preserves newlines and tabs (printable whitespace)", () => {
    // \n (0x0A) and \r (0x0D) and \t (0x09) are kept
    expect(sanitize("hello\nworld")).toBe("hello\nworld");
  });

  it("handles empty string", () => {
    expect(sanitize("")).toBe("");
  });
});
