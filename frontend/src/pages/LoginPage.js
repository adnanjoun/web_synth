import React, { useState, useContext } from "react";
import LoginForm from "../components/forms/LoginForm";
import * as mui from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import {
  login,
  register,
} from "../services/authentication/authenticationService";
import { AuthContext } from "../AuthContext";
import { useSnackbar } from "../components/SnackbarProvider";

function LoginPage() {
  const { setUser, updateAuthStatus, isAuthenticated } =
    useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  /**
   * handleInputChange
   * Updates local formData state and runs inline validations as the user types.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setError((prevError) => {
      const newError = { ...prevError };

      if (name === "username" && value.trim().length < 5) {
        newError.username = "Username must be at least 5 characters.";
      } else {
        newError.username = "";
      }

      if (name === "password" && value.length < 8) {
        newError.password = "Password must be at least 8 characters.";
      } else {
        newError.password = "";
      }

      if (
        isRegister &&
        name === "confirmPassword" &&
        value !== formData.password
      ) {
        newError.confirmPassword = "Passwords do not match.";
      } else {
        newError.confirmPassword = "";
      }

      return newError;
    });
  };

  /**
   * validateForm
   * Checks if the form meets minimum requirements:
   *  - Username >= 5 chars
   *  - Password >= 8 chars
   *  - If register mode, confirmPassword matches password
   */
  const validateForm = () => {
    const newError = {};

    if (formData.username.trim().length < 5) {
      newError.username = "Username must be at least 5 characters.";
    }

    if (formData.password.length < 8) {
      newError.password = "Password must be at least 8 characters.";
    }

    if (isRegister && formData.password !== formData.confirmPassword) {
      newError.confirmPassword = "Passwords do not match.";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  /**
   * handleLogin
   * Submits the form either for registration or login based on isRegister.
   * Displays snackbar messages if success or error.
   */
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      if (isRegister) {
        await register(formData.username, formData.password);
        showSnackbar("Registration successful! Please login.", "success");

        // Switch to login mode after registering
        setIsRegister(false);
        setFormData({ username: "", password: "", confirmPassword: "" });
      } else {
        // Store authentication data and redirects to home "/"
        const authData = await login(formData.username, formData.password);
        setUser(authData);
        updateAuthStatus(true);
        navigate("/");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  /**
   * toggleForm
   * Switches between Login and Registration mode.
   */
  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setError({});
  };

  return (
    <mui.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
      }}
    >
      <LoginForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleLogin}
        isRegister={isRegister}
        toggleForm={toggleForm}
        error={error}
      />
    </mui.Box>
  );
}

export default LoginPage;
