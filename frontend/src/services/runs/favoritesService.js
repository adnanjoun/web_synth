
const API_URL = "http://localhost:8080/api/favorites";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};


const getFavorites = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch favorites", response.status);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading favorites from DB:", error);
        return [];
    }
};


const saveFavorites = async (patients) => {
    const payload = patients.map(p => ({
        runId: p.runId,
        patientId: p.patientId || p.id
    }));

    try {
        const response = await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Server responded with error:", response.status);
            return false;
        }

    } catch (error) {
        console.error("Error saving favorites to DB:", error);
        return false;
    }
};

const removeRunFavorites = async (runId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch (`${API_URL}/run/${runId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error ("Failed to unsave favorites");
        }
        return true;

    } catch (error) {
        console.error("Error removing favorites:", error);
    }

    return false;
};

const deleteFavoriteById = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete favorite");
        }
        return true;
    } catch (error) {
        console.error("Error deleting favorite:", error);
        return false;
    }
};

export default {
    getFavorites,
    saveFavorites,
    removeRunFavorites,
    deleteFavoriteById,
};