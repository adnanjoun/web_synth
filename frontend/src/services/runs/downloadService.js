const triggerBrowserDownload = (blob, filenameFallback) => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filenameFallback;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
};

const fetchBlob = async (url) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Download error: ${response.status} ${response.statusText}`);
    }

    let filename = null;
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.indexOf("filename=") !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }
    }

    return { blob: await response.blob(), filename };
};

const downloadRunExport = async (runId, format = "fhir") => {
    const url = `http://localhost:8080/api/synthea/download?runID=${runId}&format=${format}`;
    const { blob, filename } = await fetchBlob(url);
    triggerBrowserDownload(blob, filename || `${runId}_${format}.zip`);
};

const downloadPatientsFromRun = async (runId, patientIds, format = "fhir", filenameOverride = null) => {
    const idsParam = patientIds.join(",");
    const url = `http://localhost:8080/api/synthea/downloadSelected?runID=${runId}&format=${format}&patientIds=${idsParam}`;

    const { blob, filename } = await fetchBlob(url);

    const finalFilename = filenameOverride || filename || `patients_${runId}_${format}.zip`;

    triggerBrowserDownload(blob, finalFilename);
};

const downloadFavorites = async (dbIds = [], format = "fhir") => {
    let url = `http://localhost:8080/api/favorites/download?format=${format}`;
    if (dbIds.length > 0) {
        url += `&ids=${dbIds.join(",")}`;
    }

    const { blob, filename } = await fetchBlob(url);
    triggerBrowserDownload(blob, filename || `favorites_${format}.zip`);
};

const downloadWithAuth = async (url, filenameOverride) => {
    const { blob, filename } = await fetchBlob(url);
    triggerBrowserDownload(blob, filenameOverride || filename);
};

export default {
    downloadRunExport,
    downloadPatientsFromRun,
    downloadFavorites,
    downloadWithAuth
};