import { useState, useEffect, useCallback } from "react";
import patientService from "../../services/runs/patientService";
import favoritesService from "../../services/runs/favoritesService";
import downloadService from "../../services/runs/downloadService";

const usePatientDetail = (runId, patientId) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteDbId, setFavoriteDbId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const detailedPatient = await patientService.getPatientById(runId, patientId);
                setPatient(detailedPatient);

                const favorites = await favoritesService.getFavorites();
                const favEntry = favorites.find(f => f.patientId === detailedPatient.id);

                if (favEntry) {
                    setIsFavorite(true);
                    setFavoriteDbId(favEntry.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteDbId(null);
                }

            } catch (err) {
                console.error(err);
                setError("Could not load patient details.");
            } finally {
                setLoading(false);
            }
        };

        if (runId && patientId) {
            fetchData();
        }
    }, [runId, patientId]);

    const toggleFavorite = async () => {
        if (!patient) return;

        try {
            if (isFavorite && favoriteDbId) {
                await favoritesService.deleteFavoriteById(favoriteDbId);
                setIsFavorite(false);
                setFavoriteDbId(null);
            } else {
                const patientToSave = {
                    ...patient,
                    runId: runId,
                    patientId: patient.id,
                    fullData: JSON.stringify(patient)
                };
                await favoritesService.saveFavorites([patientToSave]);

                const favorites = await favoritesService.getFavorites();
                const newFav = favorites.find(f => f.patientId === patient.id);
                if (newFav) {
                    setIsFavorite(true);
                    setFavoriteDbId(newFav.id);
                }
            }
        } catch (e) {
            console.error("Favorite toggle failed", e);
        }
    };

    const downloadPatient = async (format = "fhir") => {
        if (patient) {
            const pId = patient.patientId || patient.id;
            const safeName = patient.name.replace(/\s+/g, '_');
            const filename = `patient_${safeName}_${pId}.zip`;

            try {
                await downloadService.downloadPatientsFromRun(
                    runId,
                    [pId],
                    format,
                    filename
                );
            } catch (error) {
                console.error("Download failed:", error);
            }
        }
    };

    return {
        patient,
        loading,
        error,
        isFavorite,
        toggleFavorite,
        downloadPatient
    };
};

export default usePatientDetail;