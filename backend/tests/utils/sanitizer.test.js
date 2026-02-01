import { sanitizeDocument } from "../../src/utils/sanitizer.js";

describe("sanitizeDocument", () => {
  it("should remove specified fields from an object", () => {
    const doc = {
      name: "Test",
      __v: 1,
      createdAt: new Date(),
      password: "secret",
    };

    const result = sanitizeDocument(doc, ["__v", "createdAt", "password"]);

    expect(result).toEqual({ name: "Test" });
    expect(result.__v).toBeUndefined();
    expect(result.createdAt).toBeUndefined();
    expect(result.password).toBeUndefined();
  });

  it("should handle Mongoose documents", () => {
    const mockDoc = {
      name: "Test",
      __v: 1,
      toObject: () => ({ name: "Test", __v: 1 }),
    };

    const result = sanitizeDocument(mockDoc, ["__v"]);

    expect(result).toEqual({ name: "Test" });
  });

  it("should return null if doc is null", () => {
    const result = sanitizeDocument(null);
    expect(result).toBeNull();
  });
});
