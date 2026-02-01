import { setCookie, clearCookie } from "../../src/utils/cookieUtils.js";

// Mock CONFIG
jest.mock("../../src/config/constants.js", () => ({
  COOKIE: {
    HTTP_ONLY: true,
    SECURE: false,
    SAME_SITE: "strict",
    MAX_AGE: 604800000,
  },
}));

describe("setCookie", () => {
  it("should set cookie with token", () => {
    const mockRes = {
      cookie: jest.fn(),
    };

    setCookie(mockRes, "jwtToken");

    expect(mockRes.cookie).toHaveBeenCalledWith("token", "jwtToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 604800000,
    });
  });
});

describe("clearCookie", () => {
  it("should clear cookie", () => {
    const mockRes = {
      clearCookie: jest.fn(),
    };

    clearCookie(mockRes);

    expect(mockRes.clearCookie).toHaveBeenCalledWith("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
  });
});
