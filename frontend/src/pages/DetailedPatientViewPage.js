import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    useTheme,
    Menu,
    MenuItem
} from "@mui/material";
import {
    ArrowBack,
    FavoriteBorder,
    Favorite,
    Download as DownloadIcon,
} from "@mui/icons-material";

import Layout from "../components/layout/Layout";
import PatientSummaryCard from "../components/patientDetail/PatientSummaryCard";
import DiagnosisTab from "../components/patientDetail/DiagnosisTab";
import AllergyTab from "../components/patientDetail/AllergyTab";
import VaccinationTab from "../components/patientDetail/VaccinationTab";
import ExaminationTab from "../components/patientDetail/ExaminationTab";
import CarePlanTab from "../components/patientDetail/CarePlanTab";
import BillingTab from "../components/patientDetail/BillingTab";

import usePatientDetail from "../components/hooks/usePatientDetail";

const DetailedPatientViewPage = () => {
    const { runId, patientId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const {
        patient,
        loading,
        error,
        isFavorite,
        toggleFavorite,
        downloadPatient
    } = usePatientDetail(runId, patientId);

    const [activeTab, setActiveTab] = useState(0);

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleDownloadClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectFormat = (format) => {
        downloadPatient(format);
        handleCloseMenu();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const cardStyle = {
        p: 3,
        borderRadius: theme.shape.borderRadius || "14px",
        bgcolor: theme.palette.background.secondary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        mb: 3
    };

    if (loading) return <Layout><Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box></Layout>;
    if (error) return <Layout><Alert severity="error" sx={{ mt: 4, mx: 2 }}>{error}</Alert></Layout>;
    if (!patient) return null;

    const hasDiagnoses = patient.conditions && patient.conditions.length > 0;
    const hasAllergies = patient.allergies && patient.allergies.length > 0;
    const hasVaccinations = patient.vaccinations && patient.vaccinations.length > 0;
    const hasExaminations = patient.examinations && patient.examinations.length > 0;
    const hasCarePlans = patient.carePlans && patient.carePlans.length > 0;
    const hasClaims = patient.claims && patient.claims.length > 0;

    return (
        <Layout>
            <Box sx={{ maxWidth: "1180px", mx: "auto", p: { xs: 2, md: 3 } }}>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBack />
                        </IconButton>

                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>
                                {patient.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Run {runId} • Patient Details
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                            onClick={toggleFavorite}
                            sx={{
                                width: 44, height: 44,
                                borderRadius: "12px",
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: theme.palette.background.secondary,
                                color: isFavorite ? theme.palette.primary.main : theme.palette.text.primary,
                            }}
                        >
                            {isFavorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>

                        <IconButton
                            onClick={handleDownloadClick}
                            sx={{
                                width: 44, height: 44,
                                borderRadius: "12px",
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: theme.palette.background.secondary,
                                color: theme.palette.text.primary,
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={() => handleSelectFormat("csv")}>Download CSV</MenuItem>
                            <MenuItem onClick={() => handleSelectFormat("fhir")}>Download FHIR (JSON)</MenuItem>
                        </Menu>
                    </Box>
                </Box>

                <PatientSummaryCard patient={patient} sx={cardStyle} />

                <Paper elevation={0} sx={{ ...cardStyle, p: 0, overflow: 'hidden' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                            scrollButtons="auto"
                        >
                            <Tab
                                label={`Diagnoses (${patient.conditions?.length || 0})`}
                                disabled={!hasDiagnoses}
                                sx={{ fontWeight: 700 }}
                            />
                            <Tab
                                label={`Allergies (${patient.allergies?.length || 0})`}
                                disabled={!hasAllergies}
                                sx={{ fontWeight: 700 }}
                            />
                            <Tab
                                label={`Vaccinations (${patient.vaccinations?.length || 0})`}
                                disabled={!hasVaccinations}
                                sx={{ fontWeight: 700 }}
                            />
                            <Tab
                                label={`Examinations (${patient.examinations?.length || 0})`}
                                disabled={!hasExaminations}
                                sx={{ fontWeight: 700 }}
                            />
                            <Tab
                                label={`Care Plans (${patient.carePlans?.length || 0})`}
                                disabled={!hasCarePlans}
                                sx={{ fontWeight: 700 }}
                            />
                            <Tab
                                label={`Billing (${patient.claims?.length || 0})`}
                                disabled={!hasClaims}
                                sx={{ fontWeight: 700}}
                            />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        {activeTab === 0 && <DiagnosisTab conditions={patient.conditions || []} />}
                        {activeTab === 1 && <AllergyTab allergies={patient.allergies || []} />}
                        {activeTab === 2 && <VaccinationTab vaccinations={patient.vaccinations || []} />}
                        {activeTab === 3 && <ExaminationTab examinations={patient.examinations || []} />}
                        {activeTab === 4 && <CarePlanTab carePlans={patient.carePlans || []} />}
                        {activeTab === 5 && <BillingTab claims={patient.claims || []} />}
                    </Box>
                </Paper>

            </Box>
        </Layout>
    );
};

export default DetailedPatientViewPage;