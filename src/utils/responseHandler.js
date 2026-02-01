/**
 * Standardized Response Handler
 * Provides consistent response format across all endpoints
 * Eliminates repetitive response object creation
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data payload
 * @param {string} message - Success message
 * @param {number} status - HTTP status code (default: 200)
 * @returns {Object} JSON response
 */
export const successResponse = (
  res,
  data = null,
  message = "Success",
  status = 200,
) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default: 500)
 * @param {Object} details - Additional error details (optional)
 * @returns {Object} JSON response
 */
export const errorResponse = (
  res,
  message = "Internal Server Error",
  status = 500,
  details = null,
) => {
  const response = {
    success: false,
    message,
  };

  if (details) {
    response.details = details;
  }

  return res.status(status).json(response);
};

export default {
  successResponse,
  errorResponse,
};
