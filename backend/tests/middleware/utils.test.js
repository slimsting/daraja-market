import {
  handleValidationErrors,
  validateUserAndObjectId,
  pickAllowedFields,
} from "../../src/middleware/utils/utils.js";

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const { validationResult } = require("express-validator");

// Mock mongoose
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn(() => false),
    },
  },
}));

// Mock userModel
jest.mock("../../src/models/userModel.js", () => ({}));

describe("handleValidationErrors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if no errors", () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    handleValidationErrors(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 400 if validation errors", () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };
    const mockNext = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: "field", msg: "error" }],
    });

    handleValidationErrors(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe("validateUserAndObjectId", () => {
  const { Types } = require("mongoose");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if no user id", async () => {
    const middleware = validateUserAndObjectId("id");
    const mockReq = { params: { id: "123" } };
    const mockRes = {};
    const mockNext = jest.fn();

    await expect(middleware(mockReq, mockRes, mockNext)).rejects.toThrow(
      "Unauthorized. Please login first",
    );
  });

  it("should throw error if invalid object id", async () => {
    const middleware = validateUserAndObjectId("id");
    const mockReq = { user: { id: "user123" }, params: { id: "invalid" } };
    const mockRes = {};
    const mockNext = jest.fn();

    Types.ObjectId.isValid.mockReturnValue(false);

    await expect(middleware(mockReq, mockRes, mockNext)).rejects.toThrow(
      "Invalid id ID",
    );
  });

  it("should call next if valid", async () => {
    const middleware = validateUserAndObjectId("id");
    const mockReq = {
      user: { id: "user123" },
      params: { id: "507f1f77bcf86cd799439011" },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    Types.ObjectId.isValid.mockReturnValue(true);

    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});

describe("pickAllowedFields", () => {
  it("should pick allowed fields", () => {
    const obj = { name: "test", age: 25, email: "test@example.com" };
    const allowed = ["name", "email"];

    const result = pickAllowedFields(obj, allowed);

    expect(result).toEqual({ name: "test", email: "test@example.com" });
  });

  it("should ignore non-allowed fields", () => {
    const obj = { name: "test", age: 25 };
    const allowed = ["name"];

    const result = pickAllowedFields(obj, allowed);

    expect(result).toEqual({ name: "test" });
  });
});

describe("validateUserAndObjectId", () => {
  it("should call next if valid", async () => {
    const middleware = validateUserAndObjectId("productId");
    const mockReq = {
      user: { id: "userId" },
      params: { productId: "507f1f77bcf86cd799439011" },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should throw error if no user", async () => {
    const middleware = validateUserAndObjectId("productId");
    const mockReq = { params: { productId: "123" } };
    const mockRes = {};
    const mockNext = jest.fn();

    await expect(middleware(mockReq, mockRes, mockNext)).rejects.toThrow(
      "Unauthorized. Please login first",
    );
  });

  it("should throw error if invalid ObjectId", async () => {
    const middleware = validateUserAndObjectId("productId");
    const mockReq = {
      user: { id: "userId" },
      params: { productId: "invalid" },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    await expect(middleware(mockReq, mockRes, mockNext)).rejects.toThrow(
      "Invalid productId ID",
    );
  });
});

describe("pickAllowedFields", () => {
  it("should pick allowed fields", () => {
    const obj = { name: "Test", secret: "hidden", age: 25 };
    const allowed = ["name", "age"];

    const result = pickAllowedFields(obj, allowed);

    expect(result).toEqual({ name: "Test", age: 25 });
  });

  it("should return empty object if no matches", () => {
    const obj = { secret: "hidden" };
    const allowed = ["name"];

    const result = pickAllowedFields(obj, allowed);

    expect(result).toEqual({});
  });
});
