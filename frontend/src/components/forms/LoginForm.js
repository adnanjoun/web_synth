import React from "react";
import * as mui from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import syntheawebFullLogo from "../../assets/images/syntheaweb_primary.png";

function LoginForm({
  formData,
  onInputChange,
  onSubmit,
  isRegister,
  toggleForm,
  error,
}) {
  // Checks if the form inputs are valid
  const isFormValid =
    formData.username.trim().length >= 5 &&
    formData.password.length >= 8 &&
    (!isRegister || formData.password === formData.confirmPassword);

  return (
    <mui.Box>
      <mui.Box
        component="img"
        src={syntheawebFullLogo}
        alt="SyntheaWeb Logo"
        sx={{
          margin: 5,
          width: 400,
          height: 100,
        }}
      />

      <mui.Box
        sx={{
          backgroundColor: "background.secondary",
          padding: 6,
          borderRadius: 6,
          boxShadow: 4,
          margin: "auto",
          width: "100%",
        }}
      >
        <mui.Typography variant="h4" textAlign="center" marginBottom={3}>
          {isRegister ? "Register" : "Login"}
        </mui.Typography>

        <mui.Box
          component="form"
          onSubmit={onSubmit}
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          <mui.TextField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={onInputChange}
            error={isRegister && !!error.username}
            helperText={isRegister ? error.username || "" : ""}
            fullWidth
          />

          <mui.TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onInputChange}
            error={isRegister && !!error.password}
            helperText={isRegister ? error.password || "" : ""}
            fullWidth
          />

          {isRegister && (
            <mui.TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onInputChange}
              error={!!error.confirmPassword}
              helperText={error.confirmPassword || ""}
              fullWidth
            />
          )}

          <mui.Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          >
            <mui.Button
              type="submit"
              variant="contained"
              startIcon={isRegister ? <HowToRegIcon /> : <LoginIcon />}
              disabled={!isFormValid}
              sx={{
                width: "150px",
              }}
            >
              {isRegister ? "Register" : "Login"}
            </mui.Button>
          </mui.Box>

          <mui.Typography variant="body1" marginTop={2} textAlign="left">
            {isRegister ? "Already have an account?" : "New to SyntheaWeb?"}{" "}
            <mui.Link
              onClick={toggleForm}
              underline="hover"
              sx={{ cursor: "pointer" }}
            >
              {isRegister ? "Login" : "Register"}
            </mui.Link>
          </mui.Typography>
        </mui.Box>
      </mui.Box>
    </mui.Box>
  );
}

export default LoginForm;
