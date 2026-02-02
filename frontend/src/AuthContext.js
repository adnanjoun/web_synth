import React, { createContext, useState, useEffect } from "react";
import {
  getAuthStatus,
  logout,
} from "./services/authentication/authenticationService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Holds the authenticated user's data, or null if unauthenticated
  const [user, setUser] = useState(null);

  // Indicates whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tracks if currently loading auth status
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On mount, check for a token in localStorage.
   * If present, calls getAuthStatus() to verify and retrieve user data.
   * If verification failed, logout user.
   */
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const authData = await getAuthStatus();
        setUser(authData);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth()
      .then(() => {
        console.log("Authentication completed.");
      })
      .catch((error) => {
        console.error("Error during authentication: ", error);
      });
  }, []);

  /**
   * updateAuthStatus
   * Allows updating the authentication status.
   * Saves status to localStorage.
   */
  const updateAuthStatus = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem("isAuthenticated", status ? "true" : "false");
  };

  /**
   * handleLogout
   * Logs the user out, clears user state in localStorage.
   */
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser,
        updateAuthStatus,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
