import axios from "axios";

const API_URL = "/api/admin";

/**
 * getAuthHeaders
 * Retrieves the Bearer token from localStorage and returns an object.
 *
 * @returns {{ Authorization: string }} An object containing the Authorization header with Bearer token.
 * @throws {Error} If no token is found in localStorage.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found. Please log in again.");
  return { Authorization: `Bearer ${token}` };
};

/**
 * handleError
 * Extracts the error message from the server response.
 *
 * @param {Object} error - The error object from Axios (server or network error).
 * @param {string} [customMessage] - A custom message to use if the error does not have a detailed response.
 * @throws {Error} with the relevant message.
 */
const handleError = (error, customMessage) => {
  const message =
    error.response?.data?.message ||
    error.response?.data ||
    customMessage ||
    "An unknown error occurred.";
  throw new Error(message);
};

/**
 * getAllUsers
 * Retrieves a list of all users.
 *
 * @returns {Promise<Array>} An array of user objects.
 * @throws an error if the request fails or if the token is missing.
 */
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching users.");
  }
};

/**
 * deleteUser
 * Deletes a specified user by ID.
 *
 * @param {string} userId - The unique identifier of the user to delete.
 * @throws an error if the request fails or if the token is missing.
 */
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}/delete`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * resetPassword
 * Resets user password by ID.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} newPassword - The new password to set for the user.
 * @throws Will throw an error if the request fails or if the token is missing.
 */
export const resetPassword = async (userId, newPassword) => {
  try {
    await axios.put(
      `${API_URL}/users/${userId}/password`,
      { newPassword },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    handleError(error, `Error resetting password for user ${userId}.`);
  }
};

/**
 * updateRole
 * Updates a user's role by ID.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} newRole - The new role to assign (USER or ADMIN).
 * @throws an error if the request fails or if the token is missing.
 */
export const updateRole = async (userId, newRole) => {
  try {
    await axios.put(
      `${API_URL}/users/${userId}/role`,
      { role: newRole },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    handleError(error, `Error updating role for user ${userId}.`);
  }
};
