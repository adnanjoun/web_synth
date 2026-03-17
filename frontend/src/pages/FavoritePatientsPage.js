import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import favoritesService from "../services/runs/favoritesService";
import DownloadMenuButton from "../components/ui/DownloadMenuButton";
import downloadService from "../services/runs/downloadService";

import {
    Box,
    Typography,
    IconButton,
    Paper,
    Checkbox,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Alert,
} from "@mui/material";

import { ArrowBack, Favorite, Visibility, Download, FileDownload } from "@mui/icons-material";

const FavoritePatientsPage = () => {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]); // DB IDs

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const data = await favoritesService.getFavorites();
                setPatients(data);
            } catch (err) {
                console.error("Unexpected error", err);
                setError("Could not load favorites.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = patients.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleDownload = async (target, format) => {
        try {
            let url = `http://localhost:8080/api/favorites/download?format=${format}`;
            console.log('SELECTED: ' + selected)
            if (target === "selected") {
                url += `&ids=${selected.join(",")}`;
            }

            const dateStr = new Date().toISOString().split("T")[0];
            const filename = `favorites_${target}_${dateStr}.zip`;
            console.log("Url: " + url)
            await downloadService.downloadWithAuth(url, filename);
        } catch (e) {
            console.error("Download error:", e);
            setError("Download failed.");
        }
    };

    const handleToggleFavorite = async (patient) => {
        const updated = patients.filter((p) => p.id !== patient.id);
        setPatients(updated);

        if (selected.includes(patient.id)) {
            setSelected(selected.filter((id) => id !== patient.id));
        }

        try {
            const success = await favoritesService.deleteFavoriteById(patient.id);
            if (!success) {
                console.error("Failed to delete favorite from server.");
                setPatients(patients);
            }
        } catch (error) {
            console.error("Error executing delete:", error);
        }
    };

    const handleViewDetails = (patient) => {
        const runId = patient.runId;
        const patientId = patient.patientId;

        if (!runId || !patientId) {
            console.error("Missing runId/patientId for navigation:", patient);
            return;
        }

        navigate(`/patients/${runId}/patient/${patientId}`, {
            state: { patient },
        });
    };

    return (
        <Layout>
            <Box sx={{ p: { xs: 2, md: 4 }, width: "100%", mx: "auto" }}>
                {/* HEADER */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBack />
                    </IconButton>

                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            Saved Patients
                        </Typography>
                    </Box>

                    <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                        <DownloadMenuButton
                            variant="outlined"
                            startIcon={<Download />}
                            label={`Download All (${patients.length})`}
                            disabled={patients.length === 0}
                            onSelect={(format) => handleDownload("all", format)}
                        />

                        <DownloadMenuButton
                            variant="contained"
                            startIcon={<FileDownload />}
                            label={`Download Selected (${selected.length})`}
                            disabled={selected.length === 0}
                            onSelect={(format) => handleDownload("selected", format)}
                        />
                    </Box>
                </Box>

                {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 5 }} />}
                {error && <Alert severity="error">{error}</Alert>}

                {/* TABLE */}
                {!loading && !error && (
                    <>
                        {patients.length === 0 ? (
                            <Typography variant="body1" color="text.secondary">
                                No favorite patients saved yet.
                            </Typography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    indeterminate={selected.length > 0 && selected.length < patients.length}
                                                    checked={patients.length > 0 && selected.length === patients.length}
                                                    onChange={handleSelectAllClick}
                                                />
                                            </TableCell>
                                            <TableCell align="center">Name</TableCell>
                                            <TableCell align="center">Gender</TableCell>
                                            <TableCell align="center">Age</TableCell>
                                            <TableCell align="center">Location</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {patients.map((patient, index) => {
                                            const isItemSelected = isSelected(patient.id);
                                            return (
                                                <TableRow
                                                    key={patient.id}
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            onClick={(event) => handleClick(event, patient.id)}
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ textAlign: "left" }}>
                                                        {index + 1}. {patient.name}
                                                    </TableCell>
                                                    <TableCell align="center">{patient.gender}</TableCell>
                                                    <TableCell align="center">{patient.age} {patient.age === 1 ? "year" : "years"}</TableCell>
                                                    <TableCell align="center">{patient.location}</TableCell>

                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleToggleFavorite(patient)}
                                                            color="primary"
                                                        >
                                                            <Favorite />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleViewDetails(patient)}>
                                                            <Visibility />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default FavoritePatientsPage;
