/**
 * Document Sanitization Utility
 * Removes sensitive or internal fields from responses
 * Prevents accidental exposure of database metadata
 */

/**
 * Sanitize a MongoDB document for response
 * @param {Object} doc - MongoDB document (from Model.findById() etc)
 * @param {Array} fieldsToRemove - Fields to delete (default: ['__v', 'createdAt', 'updatedAt', 'password'])
 * @returns {Object} Sanitized plain object
 *
 * @example
 * const user = await User.findById(id);
 * const safeUser = sanitizeDocument(user, ['__v', 'password']);
 */
export const sanitizeDocument = (
  doc,
  fieldsToRemove = ["__v", "createdAt", "updatedAt", "password"],
) => {
  if (!doc) return null;

  // Convert Mongoose document to plain object
  const obj = doc.toObject ? doc.toObject() : { ...doc };

  // Remove specified fields
  fieldsToRemove.forEach((field) => {
    delete obj[field];
  });

  return obj;
};

export default {
  sanitizeDocument,
};
