import React, { useEffect, useState, useContext, useCallback } from "react";
import * as mui from "@mui/material";
import RunList from "../components/lists/RunList";
import {
  getUserRuns,
  getAllRuns,
  deleteRun,
} from "../services/runs/generatedRunService";
import { AuthContext } from "../AuthContext";
import { useSnackbar } from "../components/SnackbarProvider";
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import patientService from "../services/runs/patientService";
import downloadService from "../services/runs/downloadService";
import favoritesService from "../services/runs/favoritesService";

const RunOverviewPage = () => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [runs, setRuns] = useState([]);
  const [error, setError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [runToDelete, setRunToDelete] = useState(null);
  const [runFavoriteStatus, setRunFavoriteStatus] = useState({});
  const [dbFavorites, setDbFavorites] = useState([]);
  const [partialDialogOpen, setPartialDialogOpen] = useState(false);
  const [runToResolve, setRunToResolve] = useState(null);

  // Check if current user is an admin
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const data = isAdmin ? await getAllRuns() : await getUserRuns();
        setRuns(data);
      } catch {
        setError(true);
        showSnackbar("Error loading runs.", "error");
      }
    };
    fetchRuns().catch((err) => console.error("Fetch runs failed", err));
  }, [isAdmin, showSnackbar]);

  const fetchDbFavorites = useCallback(async () => {
    try {
      const favs = await favoritesService.getFavorites();
      setDbFavorites(Array.isArray(favs) ? favs : []);
    } catch (e) {
      console.error("Error fetching favorites:", e);
      setDbFavorites([]);
    }
  }, []);

  useEffect(() => {
    fetchDbFavorites();
  }, [fetchDbFavorites]);



  const openDeleteDialog = (runId) => {
    setRunToDelete(runId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setRunToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!runToDelete) return;
    try {
      await deleteRun(runToDelete);
      setRuns(runs.filter((run) => run.runId !== runToDelete));
      showSnackbar("Run successfully deleted.", "success");
    } catch {
      showSnackbar("Error deleting run.", "error");
    } finally {
      closeDeleteDialog();
    }
  };

  const handleDownload = async (run, format) => {
    if (!checkRunHasData(run)) return;

    showSnackbar(`Download of ${format.toUpperCase()} started.`, "info");
    try {
      await downloadService.downloadRunExport(run.runId, format);
    } catch (error) {
      console.error("Download error:", error);
      showSnackbar("Error downloading the file!", "error");
    }
  };


  useEffect(() => {
    if (runs.length === 0 || !Array.isArray(dbFavorites)) return;

    const status = {};
    runs.forEach((run) => {
      const runId = run.runId;
      const total = run.populationSize || 0;

      const savedCount = dbFavorites.filter((p) => p.runId === runId).length;

      if (savedCount === 0) {
        status[runId] = "none";
      } else if (total > 0 && savedCount >= total) {
        status[runId] = "full";
      } else {
        status[runId] = "partial";
      }
    });

    setRunFavoriteStatus(status);
  }, [runs, dbFavorites]);


  const removeAllFavoritesForRun = async (runId) => {
    showSnackbar("Removing favorites...", "info");
    const success = await favoritesService.removeRunFavorites(runId);

    if (success) {
      showSnackbar("Favorites removed.", "info");
      await fetchDbFavorites();
    } else {
      showSnackbar("Could not remove favorites.", "error");
    }
  };

  const saveAllFavoritesForRun = async (runId) => {
    showSnackbar("Saving patients to database...", "info");
    try {
      const pagedResponse = await patientService.getPatientsByRunId(runId, 0, 10000);
      const fetchedPatients = pagedResponse.patients;

      const patientsToSave = fetchedPatients.map((p) => ({
        ...p,
        runId: runId,
        patientId: p.patientId,
      }));

      const success = await favoritesService.saveFavorites(patientsToSave);

      if (success) {
        showSnackbar(`Saved ${patientsToSave.length} patients to database`, "success");
        await fetchDbFavorites();
      } else {
        showSnackbar("Failed to save patients", "error");
      }
    } catch (error) {
      console.error("Error saving patients:", error);
      showSnackbar("Could not save patients", "error");
    }
  };

  const handleFavorite = async (run) => {
    if (!checkRunHasData(run)) return;

    const currentStatus = runFavoriteStatus[run.runId] || "none";

    if (currentStatus === "full") {
      await removeAllFavoritesForRun(run.runId);

    } else if (currentStatus === "none") {
      await saveAllFavoritesForRun(run.runId);

    } else if (currentStatus === "partial") {
      setRunToResolve(run.runId);
      setPartialDialogOpen(true);
    }
  };

  const handleConfirmAddMissing = async () => {
    if (runToResolve) {
      setPartialDialogOpen(false);
      await saveAllFavoritesForRun(runToResolve);
      setRunToResolve(null);
    }
  };

  const handleConfirmRemoveAll = async () => {
    if (runToResolve) {
      setPartialDialogOpen(false);
      await removeAllFavoritesForRun(runToResolve);
      setRunToResolve(null);
    }
  };

  const handleClosePartialDialog = () => {
    setPartialDialogOpen(false);
    setRunToResolve(null);
  };

  const handleViewPatients = async (run) => {
    if (!checkRunHasData(run)) return;

    navigate(`/patients/${run.runId}`);
    console.log("View patients clicked for run: ", run);
  };

  const checkRunHasData = (run) => {
    if(run.status === "FAILED") {
      showSnackbar("Run has failed to generate due to limited server capabilities. Please try again or reduce the sample size.", "warning");
      return false;
    } else if(run.status ===  "RUNNING") {
      showSnackbar("Run is still beeing generated. Please be patient we try our best.", "info");
      return false;
    } 
    return true;
  };

  return (
      <Layout>
        <mui.Typography variant="h2" gutterBottom textAlign="center" margin={4}>
          Generated Runs
        </mui.Typography>

        {error ? (
            <mui.Typography color="error" textAlign="center">
              There was an error. Please try again later.
            </mui.Typography>
        ) : (
            <RunList
                runs={runs}
                isAdmin={isAdmin}
                onDelete={openDeleteDialog}
                onDownload={handleDownload}
                onFavorite={handleFavorite}
                onViewPatients={handleViewPatients}
                runFavoriteStatus={runFavoriteStatus}
            />
        )}

        <mui.Dialog
            open={deleteDialogOpen}
            onClose={closeDeleteDialog}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
          <mui.DialogTitle id="delete-dialog-title">
            Confirm deletion
          </mui.DialogTitle>
          <mui.DialogContent>
            <mui.DialogContentText id="delete-dialog-description">
              Do you really want to delete this run? This action cannot be undone.
            </mui.DialogContentText>
          </mui.DialogContent>
          <mui.DialogActions>
            <mui.Button onClick={closeDeleteDialog}>Cancel</mui.Button>
            <mui.Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </mui.Button>
          </mui.DialogActions>
        </mui.Dialog>
        <mui.Dialog
            open={partialDialogOpen}
            onClose={handleClosePartialDialog}
        >
          <mui.DialogTitle>Manage Favorites</mui.DialogTitle>
          <mui.DialogContent>
            <mui.DialogContentText>
              This run is partially saved. Do you want to save the missing patients or remove the existing ones?
            </mui.DialogContentText>
          </mui.DialogContent>
          <mui.DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
            <mui.Box sx={{ display: 'flex', gap: 1 }}>
              <mui.Button
                  onClick={handleConfirmAddMissing}>
                Add Missing
              </mui.Button>
              <mui.Button
                  onClick={handleConfirmRemoveAll}>
                Remove All
              </mui.Button>
            </mui.Box>

            <mui.Button onClick={handleClosePartialDialog}>
              Cancel
            </mui.Button>
          </mui.DialogActions>
        </mui.Dialog>

      </Layout>
  );
};

export default RunOverviewPage;