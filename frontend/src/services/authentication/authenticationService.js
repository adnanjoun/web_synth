import axios from "axios";

const API_URL = "/api/user";

let isLogoutInProgress = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Check if the user is on the login page
    const isOnLoginPage = window.location.pathname === "/login";

    if (
      (status === 401 || status === 403) &&
      !isLogoutInProgress &&
      !isOnLoginPage
    ) {
      isLogoutInProgress = true;

      alert("Your session has expired. Please log in again.");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setTimeout(() => {
        isLogoutInProgress = false;
      }, 3000);

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/**
 * Sends a login request with the provided username and password.
 * Saves the received token and role in localStorage.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} The response data containing the token and role.
 * @throws {Error} if the request fails.
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    const { token, role } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    return response.data;
  } catch (error) {
    const status = error.response?.status;

    if (status === 401) {
      throw new Error("Invalid username or password.");
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

/**
 * Sends a registration request with the provided username and password.
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Object} The response data.
 * @throws {Error} if the request fails.
 */
export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;

    if (status === 409) {
      throw new Error("Username already exists.");
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

/**
 * Logs out the user by removing token and role information from localStorage.
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

/**
 * Checks the authentication status by verifying the token with the server.
 * @returns {Object|null} The authentication status or null if no token exists.
 * @throws {Error} if the token is invalid or expired.
 */
export const getAuthStatus = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    // Remove the token if it is invalid or expired
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Token is invalid or expired. Removing token.");
      logout();
    }
    throw error;
  }
};
