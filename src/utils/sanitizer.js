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

/**
 * Sanitize an array of documents
 * @param {Array} docs - Array of MongoDB documents
 * @param {Array} fieldsToRemove - Fields to delete
 * @returns {Array} Array of sanitized objects
 */
export const sanitizeDocuments = (
  docs,
  fieldsToRemove = ["__v", "createdAt", "updatedAt", "password"],
) => {
  if (!Array.isArray(docs)) return [];
  return docs.map((doc) => sanitizeDocument(doc, fieldsToRemove));
};

/**
 * Sanitize with custom field selection (whitelist approach)
 * @param {Object} doc - MongoDB document
 * @param {Array} fieldsToKeep - Only these fields will be included
 * @returns {Object} Object with only specified fields
 *
 * @example
 * const user = await User.findById(id);
 * const safeUser = sanitizeDocumentBySelection(user, ['name', 'email', 'role']);
 */
export const sanitizeDocumentBySelection = (doc, fieldsToKeep) => {
  if (!doc) return null;

  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const result = {};

  fieldsToKeep.forEach((field) => {
    if (field in obj) {
      result[field] = obj[field];
    }
  });

  return result;
};

export default {
  sanitizeDocument,
  sanitizeDocuments,
  sanitizeDocumentBySelection,
};
