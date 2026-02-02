import React from "react";
import * as mui from "@mui/material";
import meduni from "../../assets/images/Logo_Center_for_Medical_Data_Science.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <mui.Box
      component="footer"
      sx={{
        backgroundColor: "primary.dark",
        color: "white",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <mui.IconButton
          href="https://data-science.meduniwien.ac.at/en/"
          target="_blank"
          disableRipple
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:focus-visible": {
              outline: "none",
            },
          }}
        >
          <mui.Box
            component="img"
            src={meduni}
            alt="MedUni Logo"
            sx={{
              height: 40,
              width: "auto",
            }}
          />
        </mui.IconButton>
      </mui.Box>

      <mui.Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <mui.Typography variant="body2" sx={{ mx: 2 }}>
          <mui.Link
            component={Link}
            to="/about"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&:hover": { textDecoration: "underline" },
            }}
          >
            About
          </mui.Link>
        </mui.Typography>

        <mui.Typography variant="body2" sx={{ mx: 2 }}>
          <mui.Link
            href="https://data-science.meduniwien.ac.at/en/institutes/medical-information-management/contact-and-map/"
            target="_blank"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Contact
          </mui.Link>
        </mui.Typography>

        <mui.Typography
          variant="body2"
          sx={{
            mx: 2,
            fontSize: { xs: "0.8rem", md: "1rem" },
          }}
        >
          © {new Date().getFullYear()} Medical University of Vienna
        </mui.Typography>
      </mui.Box>
    </mui.Box>
  );
};

export default Footer;
