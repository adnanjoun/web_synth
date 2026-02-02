import React from "react";
import * as mui from "@mui/material";
import syntheaWatermark from "../../assets/images/syntheaweb_logo_primary.png";

const Layout = ({ children }) => {
  return (
    <mui.Box
      sx={{
        position: "relative",
        minHeight: "75vh",
        overflow: "hidden",
      }}
    >
      <mui.Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${syntheaWatermark})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          opacity: 0.08,
          zIndex: -1,
        }}
      />

      <mui.Box
        sx={{
          position: "relative",
          zIndex: 1,
          padding: 3,
        }}
      >
        {children}
      </mui.Box>
    </mui.Box>
  );
};

export default Layout;
