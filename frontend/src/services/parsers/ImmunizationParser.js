export class ImmunizationParser {
    constructor(bundle) {
        this.bundle = bundle;
    }

    getAll() {
        if (!this.bundle || !Array.isArray(this.bundle.entry)) return [];

        const resources = this.bundle.entry.map((e) => e.resource).filter(Boolean);

        const norm = (ref) => {
            if (!ref) return null;
            const s = String(ref);
            if (s.startsWith("urn:uuid:")) return s.slice("urn:uuid:".length);
            const parts = s.split("/");
            return parts[parts.length - 1] || null;
        };

        const encounterById = new Map(
            resources
                .filter((r) => r.resourceType === "Encounter" && r.id)
                .map((r) => [r.id, r])
        );

        const practitionerFromEncounter = (encRef) => {
            const encId = norm(encRef);
            if (!encId) return "-";
            const enc = encounterById.get(encId);
            const p = enc?.participant?.[0]?.individual;
            return p?.display || "-";
        };

        return resources
            .filter((r) => r.resourceType === "Immunization")
            .map((r) => {
                const vaccine =
                    r.vaccineCode?.coding?.[0]?.display ||
                    r.vaccineCode?.text ||
                    "Unknown vaccine";

                const dateRaw = r.occurrenceDateTime || r.occurrenceString;
                const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : "-";

                const practitioner =
                    r.performer?.[0]?.actor?.display ||
                    practitionerFromEncounter(r.encounter?.reference);

                return {
                    id: r.id,
                    vaccine,
                    status: r.status || "unknown",
                    date,
                    practitioner,
                };
            });
    }
}
