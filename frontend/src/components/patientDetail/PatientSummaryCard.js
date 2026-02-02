import React from "react";
import { Box, Typography, Paper, Divider, Chip, Grid2, useTheme } from "@mui/material";

const PatientSummaryCard = ({ patient, sx }) => {
    const theme = useTheme();

    const renderValue = (val) => (val ? val : "-");

    const labelStyle = {
        color: theme.palette.text.secondary,
        minWidth: "100px",
        fontWeight: 500,
        fontSize: "0.9rem",
    };

    const valueStyle = {
        color: theme.palette.text.primary,
        fontWeight: 600,
    };

    const defaultCardStyle = {
        p: 3,
        borderRadius: theme.shape.borderRadius || "14px",
        bgcolor: theme.palette.background.secondary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        mb: 3,
    };

    if (!patient) return null;

    return (
        <Paper elevation={0} sx={{ ...defaultCardStyle, ...sx }}>
            <Grid2 container spacing={4}>
                <Grid2 xs={12} md={6}>
                    <Box sx={{ display: "grid", gap: 1.5 }}>
                        <Box sx={{ display: "flex" }}>
                            <Typography sx={labelStyle}>Gender:</Typography>
                            <Typography sx={valueStyle}>{renderValue(patient.gender)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                            <Typography sx={labelStyle}>Age:</Typography>
                            <Typography sx={valueStyle}>{renderValue(patient.age)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                            <Typography sx={labelStyle}>Birthdate:</Typography>
                            <Typography sx={valueStyle}>{renderValue(patient.birthDate)}</Typography>
                        </Box>
                    </Box>
                </Grid2>

                <Grid2 xs={12} md={6}>
                    <Box sx={{ display: "grid", gap: 1.5 }}>
                        <Box sx={{ display: "flex" }}>
                            <Typography sx={labelStyle}>Location:</Typography>
                            <Typography sx={valueStyle}>
                                {renderValue(patient.location || patient.address)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                            <Typography sx={labelStyle}>Tel:</Typography>
                            <Typography sx={valueStyle}>{renderValue(patient.telecom)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                            <Typography sx={labelStyle}>E-Mail:</Typography>
                            <Typography sx={valueStyle}>{renderValue(patient.email)}</Typography>
                        </Box>
                    </Box>
                </Grid2>
            </Grid2>

            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label={`Language: ${renderValue(patient.communication)}`} />
                <Chip label={`Family Status: ${renderValue(patient.maritalStatus)}`} />
                <Chip label={`SSN: ${renderValue(patient.ssn)}`} />
                <Chip label={`MRN: ${renderValue(patient.mrn)}`} />
            </Box>
        </Paper>
    );
};

export default PatientSummaryCard;
