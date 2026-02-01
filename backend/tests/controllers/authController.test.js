import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../../src/controllers/authController.js";

// Mock dependencies
jest.mock("../../src/models/userModel.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../src/utils/cookieUtils.js");
jest.mock("../../src/utils/responseHandler.js");
jest.mock("../../src/utils/logger.js");
jest.mock("../../src/config/constants.js", () => ({
  BCRYPT: { ROUNDS: 10 },
  JWT: { EXPIRY: "7d" },
}));

import User from "../../src/models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie, clearCookie } from "../../src/utils/cookieUtils.js";
import { successResponse } from "../../src/utils/responseHandler.js";

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        role: "user",
      },
    };
    const mockRes = {};

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(),
      _id: "userId",
      role: "user",
    }));
    jwt.sign.mockReturnValue("token");
    setCookie.mockImplementation(() => {});
    successResponse.mockReturnValue("success");

    await register(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(User).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "hashedPassword",
      name: "Test User",
      role: "user",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "userId", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    expect(setCookie).toHaveBeenCalledWith(mockRes, "token");
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      null,
      "user registered successfully",
      201,
    );
  });

  it("should throw error if user already exists", async () => {
    const mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const mockRes = {};

    User.findOne.mockResolvedValue({ email: "test@example.com" });

    await expect(register(mockReq, mockRes)).rejects.toThrow(
      "User already exists with that email",
    );
  });

  it("should throw error if admin reg code is invalid", async () => {
    const mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
        role: "admin",
        adminRegCode: "wrongCode",
      },
    };
    const mockRes = {};

    User.findOne.mockResolvedValue(null);
    process.env.ADMIN_REG_CODE = "correctCode";

    await expect(register(mockReq, mockRes)).rejects.toThrow(
      "Invalid admin registration code",
    );
  });

  it("should register an admin successfully", async () => {
    const mockReq = {
      body: {
        email: "admin@example.com",
        password: "password123",
        name: "Admin User",
        role: "admin",
        adminRegCode: "correctCode",
      },
    };
    const mockRes = {};

    User.findOne.mockResolvedValue(null);
    process.env.ADMIN_REG_CODE = "correctCode";
    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(),
      _id: "adminId",
      role: "admin",
    }));
    jwt.sign.mockReturnValue("token");
    setCookie.mockImplementation(() => {});
    successResponse.mockReturnValue("success");

    await register(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "admin@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(User).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "hashedPassword",
      name: "Admin User",
      role: "admin",
      adminRegCode: "correctCode",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "adminId", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    expect(setCookie).toHaveBeenCalledWith(mockRes, "token");
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      null,
      "user registered successfully",
      201,
    );
  });
});

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login user successfully", async () => {
    const mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const mockRes = {};

    const mockUser = {
      _id: "userId",
      role: "user",
      password: "hashedPassword",
      name: "Test User",
      userEmail: "test@example.com",
      phone: "1234567890",
      location: "Test Location",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token");
    setCookie.mockImplementation(() => {});
    successResponse.mockReturnValue("success");

    await login(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword",
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "userId", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    expect(setCookie).toHaveBeenCalledWith(mockRes, "token");
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      {
        name: "Test User",
        userEmail: "test@example.com",
        role: "user",
        phone: "1234567890",
        location: "Test Location",
      },
      "Logged in successfully",
      200,
    );
  });

  it("should throw error if user not found", async () => {
    const mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const mockRes = {};

    User.findOne.mockResolvedValue(null);

    await expect(login(mockReq, mockRes)).rejects.toThrow(
      "wrong username or password",
    );
  });

  it("should throw error if password does not match", async () => {
    const mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const mockRes = {};

    User.findOne.mockResolvedValue({ password: "hashedPassword" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(login(mockReq, mockRes)).rejects.toThrow(
      "wrong username or password",
    );
  });
});

describe("logout", () => {
  it("should logout user successfully", async () => {
    const mockReq = {};
    const mockRes = {};

    clearCookie.mockImplementation(() => {});
    successResponse.mockReturnValue("success");

    await logout(mockReq, mockRes);

    expect(clearCookie).toHaveBeenCalledWith(mockRes);
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      null,
      "Logged out successfully",
      200,
    );
  });
});

describe("getCurrentUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get current user successfully", async () => {
    const mockReq = {
      user: { id: "userId" },
    };
    const mockRes = {};

    const mockUser = {
      name: "Test User",
      email: "test@example.com",
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    successResponse.mockReturnValue("success");

    await getCurrentUser(mockReq, mockRes);

    expect(User.findById).toHaveBeenCalledWith("userId");
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      mockUser,
      "Current user retrieved successfully",
      200,
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

    await expect(getCurrentUser(mockReq, mockRes)).rejects.toThrow(
      "User not found",
    );
  });
});
