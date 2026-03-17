import React, { useState, useContext } from "react";
import * as mui from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import syntheawebLogo from "../../assets/images/syntheaweb_white.png";

function Navbar() {
  const { isAuthenticated, user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isAdmin = user?.role === "ADMIN";

  // If user is not authenticated, navbar will not render
  if (!isAuthenticated) return null;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <mui.AppBar
        position="static"
        sx={{ backgroundColor: "primary.dark", boxShadow: 1 }}
      >
        <mui.Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          <mui.Box
            component="img"
            src={syntheawebLogo}
            alt="SyntheaWeb Logo"
            sx={{
              width: "auto",
              height: 40,
              transition: "transform 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate("/")}
          />

          <mui.Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
          <mui.Link
              component={Link}
              to="/favorites"
              sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&:hover": { color: "primary.light" },
              }}
          >
              Saved Patients
          </mui.Link>
            <mui.Link
              component={Link}
              to="/generate"
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontWeight: "bold",
                fontSize: "1rem",
                "&:hover": { color: "primary.light" },
              }}
            >
              Generate Data
            </mui.Link>
            <mui.Link
              component={Link}
              to="/runs"
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontWeight: "bold",
                fontSize: "1rem",
                "&:hover": { color: "primary.light" },
              }}
            >
              Run Overview
            </mui.Link>
            {isAdmin && (
              <mui.Link
                component={Link}
                to="/admin"
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&:hover": { color: "primary.light" },
                }}
              >
                Admin
              </mui.Link>
            )}

            <mui.Box
              onClick={handleLogout}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.primary",
                borderRadius: "8px",
                padding: "5px 10px",
                fontWeight: "bold",
                backgroundColor: "grey",
                "&:hover": {
                  backgroundColor: "#B71C1C",
                },
              }}
            >
              <LogoutIcon />
              Logout
            </mui.Box>
          </mui.Box>

          <mui.IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "text.primary" }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </mui.IconButton>

          <mui.Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <mui.MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/generate");
              }}
            >
              <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
              Generate Data
            </mui.MenuItem>
            <mui.MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/runs");
              }}
            >
              <ListIcon sx={{ marginRight: 1 }} />
              Run Overview
            </mui.MenuItem>
            {isAdmin && (
              <mui.MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/admin");
                }}
              >
                <AccountCircleIcon sx={{ marginRight: 1 }} />
                Admin
              </mui.MenuItem>
            )}
            <mui.Divider />
            <mui.MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
                navigate("/login");
              }}
            >
              <LogoutIcon sx={{ marginRight: 1 }} />
              Logout
            </mui.MenuItem>
          </mui.Menu>
        </mui.Toolbar>
      </mui.AppBar>
    </>
  );
}

export default Navbar;
