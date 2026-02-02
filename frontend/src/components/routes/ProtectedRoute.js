import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as mui from "@mui/material";
import { AuthContext } from "../../AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    /**
     * While the authentication status is being checked, display a loading indicator.
     * (when user base is large, won't occur with Prototype
     */
    if (isLoading) {
        return (
            <mui.Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="background.default"
            >
                <mui.CircularProgress />
            </mui.Box>
        );
    }


    /**
     * If the user is not authenticated or no token is found redirect to the login page.
     */
    if (!token || !isAuthenticated) {
        return <Navigate to="/login" />;
    }


    /**
     * If the user is authenticated allow access to the protected routes.
     */
    return <Outlet />;
};

export default ProtectedRoute;
