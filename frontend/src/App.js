import React from "react";
import GeneratePage from "./pages/GeneratePage.js";
import LoginPage from "./pages/LoginPage.js";
import HomePage from "./pages/HomePage.js";
import Navbar from "./components/layout/NavBar.js";
import * as mui from "@mui/material";
import theme from "./styles/theme.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RunOverviewPage from "./pages/RunOverviewPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import ProtectedAdminRoute from "./components/routes/ProtectedAdminRoute";
import { AuthProvider } from "./AuthContext";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/layout/Footer";
import { SnackbarProvider } from "./components/SnackbarProvider";
import PatientsPage from "./pages/PatientsPage";
import FavoritePatientsPage from "./pages/FavoritePatientsPage";
import DetailedPatientViewPage from "./pages/DetailedPatientViewPage";


function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <Router>
            <mui.Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Navbar />
              <mui.Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <mui.Container>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/generate" element={<GeneratePage />} />
                      <Route path="/runs" element={<RunOverviewPage />} />
                      <Route path="/patients/:runId" element={<PatientsPage />} />
                      <Route path="/favorites" element={<FavoritePatientsPage />} />
                      <Route path="/patients/:runId/patient/:patientId" element={<DetailedPatientViewPage />} />
                    </Route>
                    <Route element={<ProtectedAdminRoute />}>
                      <Route path="/admin" element={<AdminPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </mui.Container>
              </mui.Box>
              <Footer />
            </mui.Box>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
