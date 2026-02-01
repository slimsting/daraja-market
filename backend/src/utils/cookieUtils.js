/**
 * Cookie Utilities
 * Centralizes cookie handling logic (setting and clearing)
 * Ensures consistent cookie configuration across endpoints
 */

import CONFIG from "../config/constants.js";

/**
 * Set authentication token cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to set
 * @example
 * setCookie(res, jwtToken);
 */
export const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: CONFIG.COOKIE.HTTP_ONLY,
    secure: CONFIG.COOKIE.SECURE,
    sameSite: CONFIG.COOKIE.SAME_SITE,
    maxAge: CONFIG.COOKIE.MAX_AGE,
  });
};

/**
 * Clear authentication token cookie
 * @param {Object} res - Express response object
 * @example
 * clearCookie(res);
 */
export const clearCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: CONFIG.COOKIE.HTTP_ONLY,
    secure: CONFIG.COOKIE.SECURE,
    sameSite: CONFIG.COOKIE.SAME_SITE,
  });
};

export default {
  setCookie,
  clearCookie,
};
