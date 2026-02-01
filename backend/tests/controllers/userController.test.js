import {
  getAllFarmers,
  getAllBrokers,
} from "../../src/controllers/userController.js";

// Mock dependencies
jest.mock("../../src/models/userModel.js");
jest.mock("../../src/utils/sanitizer.js");
jest.mock("../../src/utils/responseHandler.js");

import User from "../../src/models/userModel.js";
import { sanitizeDocument } from "../../src/utils/sanitizer.js";
import { successResponse } from "../../src/utils/responseHandler.js";

describe("getAllFarmers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all farmers successfully for admin", async () => {
    const mockReq = {
      user: { id: "adminId" },
    };
    const mockRes = {};

    const mockFarmers = [
      {
        name: "Farmer1",
        email: "farmer1@example.com",
        role: "farmer",
        phone: "123",
        location: "Loc1",
      },
      {
        name: "Farmer2",
        email: "farmer2@example.com",
        role: "farmer",
        phone: "456",
        location: "Loc2",
      },
    ];

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ role: "admin" }),
    });
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockFarmers),
      }),
    });
    sanitizeDocument.mockImplementation((doc) => doc);
    successResponse.mockReturnValue("success");

    await getAllFarmers(mockReq, mockRes);

    expect(User.findById).toHaveBeenCalledWith("adminId");
    expect(User.find).toHaveBeenCalledWith({ role: "farmer" });
    expect(sanitizeDocument).toHaveBeenCalledTimes(2);
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      mockFarmers,
      "Successfully retrieved all farmers",
    );
  });

  it("should throw error if not logged in", async () => {
    const mockReq = {};
    const mockRes = {};

    await expect(getAllFarmers(mockReq, mockRes)).rejects.toThrow(
      "Unauthorized. Please login first",
    );
  });

  it("should throw error if user not found", async () => {
    const mockReq = {
      user: { id: "userId" },
    };
    const mockRes = {};

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(getAllFarmers(mockReq, mockRes)).rejects.toThrow(
      "User not found",
    );
  });

  it("should throw error if not admin", async () => {
    const mockReq = {
      user: { id: "userId" },
    };
    const mockRes = {};

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ role: "farmer" }),
    });

    await expect(getAllFarmers(mockReq, mockRes)).rejects.toThrow(
      "Access denied. Only admins can view farmers",
    );
  });
});

describe("getAllBrokers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all brokers successfully for admin", async () => {
    const mockReq = {
      user: { id: "adminId" },
    };
    const mockRes = {};

    const mockBrokers = [
      { name: "Broker1", email: "broker1@example.com", phone: "123" },
      { name: "Broker2", email: "broker2@example.com", phone: "456" },
    ];

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ role: "admin" }),
    });
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBrokers),
      }),
    });
    sanitizeDocument.mockImplementation((doc) => doc);
    successResponse.mockReturnValue("success");

    await getAllBrokers(mockReq, mockRes);

    expect(User.findById).toHaveBeenCalledWith("adminId");
    expect(User.find).toHaveBeenCalledWith({ role: "broker" });
    expect(sanitizeDocument).toHaveBeenCalledTimes(2);
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      mockBrokers,
      "Successfully retrieved all brokers",
    );
  });

  it("should throw error if not logged in", async () => {
    const mockReq = {};
    const mockRes = {};

    await expect(getAllBrokers(mockReq, mockRes)).rejects.toThrow(
      "Unauthorized. Please login first",
    );
  });

  it("should throw error if user not found", async () => {
    const mockReq = {
      user: { id: "userId" },
    };
    const mockRes = {};

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(getAllBrokers(mockReq, mockRes)).rejects.toThrow(
      "User not found",
    );
  });

  it("should throw error if not admin", async () => {
    const mockReq = {
      user: { id: "userId" },
    };
    const mockRes = {};

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ role: "farmer" }),
    });

    await expect(getAllBrokers(mockReq, mockRes)).rejects.toThrow(
      "Access denied. Only admins can view brokers",
    );
  });
});
