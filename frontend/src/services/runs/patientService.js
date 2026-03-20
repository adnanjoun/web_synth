import { FhirPatientParser } from "../parsers/fhirParser";
import { DiagnosisParser } from "../parsers/DiagnosisParser";
import { AllergyParser } from "../parsers/AllergyParser";
import { ImmunizationParser } from "../parsers/ImmunizationParser";
import { ExaminationParser } from "../parsers/ExaminationParser";
import { CarePlanParser } from "../parsers/CarePlanParser";
import { BillingParser } from "../parsers/BillingParser";

const BASE_URL = "/api";


const getPatientsByRunId = async (runId, page = 0, size = 50, filters = {}) => {
    const token = localStorage.getItem("token");

    let url = `${BASE_URL}/patients/run/${runId}?page=${page}&size=${size}`;

    if (filters.name) url += `&name=${encodeURIComponent(filters.name)}`;
    if (filters.gender && filters.gender !== "all") url += `&gender=${encodeURIComponent(filters.gender)}`;
    if (filters.minAge) url += `&minAge=${filters.minAge}`;
    if (filters.maxAge) url += `&maxAge=${filters.maxAge}`;

    if (Array.isArray(filters.locations) && filters.locations.length > 0) {
        filters.locations
            .filter((l) => l != null && String(l).length > 0)
            .forEach((loc) => {
                url += `&locations=${encodeURIComponent(String(loc).trim())}`;
            });
        console.log(url);
    }

    const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Error fetching patients: ${response.statusText}`);
    }

    const data = await response.json();
    const patientList = data.content ? data.content : data;

    const cleanPatients = patientList.map((dto) => ({
        id: dto.patientId,
        runId: dto.runId,
        name: dto.name,
        gender: dto.gender,
        age: dto.age,
        location: dto.location,
    }));

    return {
        patients: cleanPatients,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || cleanPatients.length,
    };
};

const getPatientById = async (runId, patientId) => {
    const token = localStorage.getItem("token");

    const url =
        `${BASE_URL}/patients/details?runId=${encodeURIComponent(runId)}` +
        `&patientId=${encodeURIComponent(patientId)}`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to load patient data");

    const text = await response.text();
    const bundle = JSON.parse(text);

    const basicParser = new FhirPatientParser(bundle, 0);
    const basicInfo = basicParser.getBasicInfo();

    const diagnosisParser = new DiagnosisParser(bundle);
    const allergyParser = new AllergyParser(bundle);
    const immunizationParser = new ImmunizationParser(bundle);
    const examinationParser = new ExaminationParser(bundle);
    const carePlanParser = new CarePlanParser(bundle);
    const billingParser = new BillingParser(bundle);

    return {
        ...(basicInfo || {}),
        runId,
        conditions: diagnosisParser.getAll(),
        allergies: allergyParser.getAll(),
        vaccinations: immunizationParser.getAll(),
        examinations: examinationParser.getAll(),
        carePlans: carePlanParser.getAll(),
        claims: billingParser.getAll(),
        _rawBundle: bundle,
    };
};

const getRunStatistics = async (runId, filters = {}) => {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.gender && filters.gender !== "all") params.append("gender", filters.gender);
    if (filters.minAge) params.append("minAge", filters.minAge);
    if (filters.maxAge) params.append("maxAge", filters.maxAge);

    if (Array.isArray(filters.locations) && filters.locations.length > 0) {
        filters.locations
            .filter((l) => l != null && String(l).trim().length > 0)
            .forEach((loc) => {
                params.append("locations", String(loc).trim());
            });
    }

    const url = `${BASE_URL}/patients/run/${runId}/statistics?${params.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Error fetching statistics: ${response.statusText}`);
    }

    return await response.json();
};

const getLocationsByRunId = async (runId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/patients/locations/${runId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Could not load locations");
    return await response.json();
};

export default {
    getPatientsByRunId,
    getPatientById,
    getLocationsByRunId,
    getRunStatistics
};
