export class DiagnosisParser {
    constructor(bundle) {
        this.bundle = bundle;
    }


    getAll() {
        if (!this.bundle || !this.bundle.entry) {
            return [];
        }

        const byFullUrl = new Map(
            this.bundle.entry
                .filter((e) => e && e.fullUrl && e.resource)
                .map((e) => [e.fullUrl, e.resource])
        );

        const buildPractitionerName = (practitioner) => {
            if (!practitioner || practitioner.resourceType !== "Practitioner") return "-";

            const n = practitioner.name?.[0];
            if (!n) return "-";

            const prefix = (n.prefix || []).join(" ");
            const given = (n.given || []).join(" ");
            const family = n.family || "";

            return [prefix, given, family].filter(Boolean).join(" ").trim() || "-";
        };

        const getPractitionerFromEncounterRef = (encounterRef) => {
            if (!encounterRef) return "-";

            const enc = byFullUrl.get(encounterRef);
            if (!enc || enc.resourceType !== "Encounter") return "-";

            const participant =
                (enc.participant || []).find(
                    (p) => p?.type?.[0]?.coding?.[0]?.code === "PPRF"
                ) || enc.participant?.[0];

            if (!participant?.individual) return "-";

            if (participant.individual.display) return participant.individual.display;

            const practitioner = byFullUrl.get(participant.individual.reference);
            return buildPractitionerName(practitioner);
        };

        return this.bundle.entry
            .map((entry) => entry.resource)
            .filter((resource) => resource.resourceType === "Condition")
            .map((condition) => {
                const diagnosis =
                    condition.code?.text ||
                    condition.code?.coding?.[0]?.display ||
                    "Unknown Condition";

                const status = condition.clinicalStatus?.coding?.[0]?.code || "unknown";

                const rawDate = condition.onsetDateTime || condition.recordedDate;
                const begin = rawDate ? new Date(rawDate).toLocaleDateString() : "-";

                const end = condition.abatementDateTime
                    ? new Date(condition.abatementDateTime).toLocaleDateString()
                    : "-";

                const practitionerDirect =
                    condition.recorder?.display || condition.asserter?.display || null;

                const practitioner =
                    practitionerDirect ||
                    getPractitionerFromEncounterRef(condition.encounter?.reference) ||
                    "-";

                return {
                    id: condition.id,
                    diagnosis,
                    code: condition.code?.coding?.[0]?.code || "-",
                    status,
                    begin,
                    end,
                    practitioner,
                };
            });
    }
}
