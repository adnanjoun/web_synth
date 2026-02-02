import React, {useState, useEffect, useCallback, useMemo} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {ArrowBack, Download, FileDownload} from "@mui/icons-material";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Pagination,
} from "@mui/material";

import Layout from "../components/layout/Layout";
import DownloadMenuButton from "../components/ui/DownloadMenuButton";
import patientService from "../services/runs/patientService";
import favoritesService from "../services/runs/favoritesService";
import downloadService from "../services/runs/downloadService";
import PatientsCharts from "./patients/PatientsCharts";
import PatientsTable from "./patients/PatientsTable";
import {
    buildGenderDataFromStatistics,
    buildAgeDataFromStatistics
} from "./patients/PatientStats";
import useTableFilter from "../components/hooks/useTableFilter";
import PatientFilterBar from "../components/hooks/PatientFilterBar";

const PAGE_SIZE = 20;

const PatientsPage = () => {
    const {runId} = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [patients, setPatients] = useState([]);
    const [statistics, setStatistics] = useState(null);

    const {filters, setFilter, resetFilters} = useTableFilter([]);

    const [availableLocations, setAvailableLocations] = useState([]);
    const [selectedSet, setSelectedSet] = useState(() => new Set());

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // debounce filters
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilters(filters), 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const backendPage = page - 1;

            const results = await Promise.allSettled([
                patientService.getPatientsByRunId(runId, backendPage, PAGE_SIZE, debouncedFilters),
                favoritesService.getFavorites(),
            ]);

            const pagedResult = results[0].status === "fulfilled" ? results[0].value : null;
            const favoriteData = results[1].status === "fulfilled" ? results[1].value : [];

            if (!pagedResult) throw new Error("Patients request failed");

            const favMap = new Map();
            if (Array.isArray(favoriteData)) {
                favoriteData.forEach((fav) => favMap.set(fav.patientId, fav));
            }

            const loadedPatients = pagedResult.content || pagedResult.patients || [];
            const total = pagedResult.totalPages ?? 1;
            const elements = pagedResult.totalElements ?? loadedPatients.length;

            const mergedPatients = loadedPatients.map((p) => {
                const pid = p.id ?? p.patientId;
                const existingFav = favMap.get(pid);
                return {
                    ...p,
                    isFavorite: !!existingFav,
                    favoriteDbId: existingFav ? existingFav.id : null,
                };
            });

            setPatients(mergedPatients);
            setTotalPages(total);
            setTotalElements(elements);
        } catch (err) {
            console.error(err);
            setError("Could not load Patient Data.");
        } finally {
            setLoading(false);
        }
    }, [runId, page, debouncedFilters]);

    useEffect(() => {
        if (runId) loadData();
    }, [runId, loadData]);

    useEffect(() => {
        if (!runId) return;

        const loadStats = async () => {
            try {
                const statsData = await patientService.getRunStatistics(runId, debouncedFilters);
                console.log("Run statistics dto: ", statsData);
                setStatistics(statsData);
            } catch (e) {
                console.error("Could not load stats", e);
            }
        };

        loadStats();
    }, [runId, debouncedFilters]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const totalPopulation = totalElements;
    const selectedCount = selectedSet.size;

    const toggleSelected = useCallback((id) => {
        setSelectedSet((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleSelectAllVisible = useCallback((visiblePatients, checked) => {
        setSelectedSet((prev) => {
            const next = new Set(prev);
            if (checked) {
                visiblePatients.forEach((p) => next.add(p.id));
            } else {
                visiblePatients.forEach((p) => next.delete(p.id));
            }
            return next;
        });
    }, []);

    const handleToggleFavorite = async (patient) => {
        try {
            if (patient.isFavorite) {
                if (patient.favoriteDbId) await favoritesService.deleteFavoriteById(patient.favoriteDbId);
            } else {
                const patientToSave = {
                    ...patient,
                    runId,
                    patientId: patient.id,
                    fullData: JSON.stringify(patient),
                };
                await favoritesService.saveFavorites([patientToSave]);
            }
            await loadData();
        } catch (e) {
            console.error("Error: Favorite-Toggle:", e);
        }
    };

    const handleDownload = async (target, format) => {
        try {
            const hasActiveFilters =
                debouncedFilters.name ||
                (debouncedFilters.gender && debouncedFilters.gender !== "all") ||
                debouncedFilters.minAge ||
                debouncedFilters.maxAge ||
                (debouncedFilters.locations && debouncedFilters.locations.length > 0);

            const dateStr = new Date().toISOString().split("T")[0];

            if (target === "all") {
                if (!hasActiveFilters) {
                    await downloadService.downloadRunExport(runId, format);
                } else {
                    const result = await patientService.getPatientsByRunId(runId, 0, totalElements, debouncedFilters);
                    const list = result.patients || [];
                    const idsToDownload = list.map((p) => p.id);

                    if (idsToDownload.length === 0) {
                        setError("No patients found with current filters.");
                        return;
                    }

                    const filename = `patients_filtered_${runId}_${format}_${dateStr}.zip`;
                    await downloadService.downloadPatientsFromRun(runId, idsToDownload, format, filename);
                }
            } else {
                const idsToDownload = Array.from(selectedSet);
                if (idsToDownload.length === 0) return;

                const filename = `patients_selected_${runId}_${format}_${dateStr}.zip`;
                await downloadService.downloadPatientsFromRun(runId, idsToDownload, format, filename);
            }

        } catch (e) {
            console.error("Download error:", e);
            setError("Download failed. Please try again.");
        }
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locs = await patientService.getLocationsByRunId(runId);
                setAvailableLocations([...new Set(locs)]);
            } catch (e) {
                console.error("Failed to load locations", e);
            }
        };
        if (runId) fetchLocations();
    }, [runId]);
    const genderData = useMemo(() =>
            buildGenderDataFromStatistics(statistics),
        [statistics]);

    const ageData = useMemo(() =>
            buildAgeDataFromStatistics(statistics),
        [statistics]);

    return (
        <Layout>
            <Box sx={{p: {xs: 2, md: 4}, width: "100%", mx: "auto"}}>
                {/* HEADER */}
                <Box sx={{display: "flex", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2}}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBack/>
                    </IconButton>

                    <Box>
                        <Typography variant="h4" sx={{fontWeight: "bold"}}>
                            Population Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Patients of run {runId}
                        </Typography>
                    </Box>

                    {/* DOWNLOADS */}
                    <Box sx={{marginLeft: "auto", display: "flex", gap: 2}}>
                        <DownloadMenuButton
                            variant="outlined"
                            startIcon={<Download/>}
                            label={`Download All (${totalElements})`}
                            disabled={totalElements === 0}
                            onSelect={(format) => handleDownload("all", format)}
                        />
                        <DownloadMenuButton
                            variant="contained"
                            startIcon={<FileDownload/>}
                            label={`Download Selected (${selectedCount})`}
                            disabled={selectedCount === 0}
                            onSelect={(format) => handleDownload("selected", format)}
                        />
                    </Box>
                </Box>

                {/* STATUS */}
                {loading && (
                    <Box sx={{display: "flex", justifyContent: "center", my: 10}}>
                        <CircularProgress/>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{mb: 4}}>
                        {error}
                    </Alert>
                )}

                {/* CONTENT */}
                {!loading && !error && (
                    <>
                        <PatientsCharts
                            totalPopulation={totalPopulation}
                            genderData={genderData}
                            ageData={ageData}
                            theme={theme}
                        />

                        <PatientFilterBar
                            filters={filters}
                            onFilterChange={(key, val) => {
                                setFilter(key, val);
                                setPage(1);
                            }}
                            onReset={() => {
                                resetFilters();
                                setPage(1);
                            }}
                            availableLocations={availableLocations}
                        />

                        <PatientsTable
                            patients={patients}
                            totalElements={totalElements}
                            page={page}
                            pageSize={PAGE_SIZE}
                            selectedSet={selectedSet}
                            onToggleSelected={toggleSelected}
                            onToggleSelectAllVisible={toggleSelectAllVisible}
                            onToggleFavorite={handleToggleFavorite}
                            onViewDetails={(patientId) => navigate(`/patients/${runId}/patient/${patientId}`)}
                        />

                        <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default PatientsPage;
