import {
  successResponse,
  errorResponse,
} from "../../src/utils/responseHandler.js";

describe("successResponse", () => {
  it("should send success response with data", () => {
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };

    const result = successResponse(mockRes, { id: 1 }, "Success message", 200);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.status().json).toHaveBeenCalledWith({
      success: true,
      message: "Success message",
      data: { id: 1 },
    });
  });

  it("should send success response without data", () => {
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };

    const result = successResponse(mockRes, null, "Success message", 201);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.status().json).toHaveBeenCalledWith({
      success: true,
      message: "Success message",
    });
  });

  it("should use default status 200", () => {
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };

    const result = successResponse(mockRes, "data");

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});

describe("errorResponse", () => {
  it("should send error response with details", () => {
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };

    const result = errorResponse(mockRes, "Error message", 400, {
      field: "error",
    });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Error message",
      details: { field: "error" },
    });
  });

  it("should send error response without details", () => {
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };

    const result = errorResponse(mockRes, "Error message", 500);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Error message",
    });
  });

  it("should use default status 500", () => {
    const mockRes = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    };

    const result = errorResponse(mockRes, "Error message");

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
