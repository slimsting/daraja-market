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

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation error objects
 * @returns {Object} JSON response
 */
export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: errors.map((error) => ({
      field: error.path || error.field,
      message: error.msg || error.message,
    })),
  });
};

export default {
  successResponse,
  errorResponse,
  validationErrorResponse,
};
