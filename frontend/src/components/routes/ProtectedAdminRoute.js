import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import * as mui from "@mui/material";


const ProtectedAdminRoute = () => {
    const { isAuthenticated, user, isLoading } = useContext(AuthContext);

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
     * If the user is not authenticated or does not have ADMIn role redirect to the home page.
     */
    if (!isAuthenticated || user?.role !== "ADMIN") {
        return <Navigate to="/" />;
    }


    /**
     * If the user is authenticated and has ADMIN role, allow access to the protected admin route.
     */
    return <Outlet />;
};

export default ProtectedAdminRoute;
