import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as mui from "@mui/material";
import { AuthContext } from "../AuthContext";
import syntheawebLogo2 from "../assets/images/syntheaweb_logo_primary.png";

function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <mui.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <mui.Box
        component="img"
        src={syntheawebLogo2}
        alt="SyntheaWeb Logo"
        sx={{
          margin: 5,
          width: 200,
          height: 200,
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />

      <mui.Typography variant="h2" gutterBottom>
        Welcome to SyntheaWeb, {user.username}!
      </mui.Typography>
      <mui.Typography
        variant="body1"
        sx={{ maxWidth: "600px", marginBottom: 4 }}
      >
        Generate synthetic healthcare data easily and efficiently.
      </mui.Typography>

      <mui.Card
        sx={{
          maxWidth: 350,
          padding: 1,
          backgroundColor: "primary.main",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 4,
          marginTop: 2,
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          cursor: "pointer",
        }}
        onClick={() => navigate("/generate")}
      >
        <mui.CardContent>
          <mui.Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Generate Data
          </mui.Typography>
          <mui.Typography
            variant="body2"
            sx={{
              marginBottom: 2,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Use SyntheaWeb to create realistic synthetic healthcare datasets.
          </mui.Typography>
        </mui.CardContent>
      </mui.Card>
    </mui.Box>
  );
}

export default HomePage;
