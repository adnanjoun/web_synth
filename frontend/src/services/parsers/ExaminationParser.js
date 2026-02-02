export class ExaminationParser {
    constructor(bundle) {
        this.bundle = bundle;
    }

    getAll() {
        if (!this.bundle || !this.bundle.entry) {
            return [];
        }

        return this.bundle.entry
            .map(entry => entry.resource)
            .filter(resource => resource.resourceType === "Observation")
            .map(observation => {
                const examination = observation.code?.text || observation.code?.coding?.[0]?.display || "Unknown Examination";

                const dateRaw = observation.effectiveDateTime || observation.issued;
                const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : "-";

                let value = "-";
                let unit = "";

                if (observation.valueQuantity) {
                    value = parseFloat(observation.valueQuantity.value).toFixed(2);
                    unit = observation.valueQuantity.unit || "";
                } else if (observation.valueCodeableConcept) {
                    value = observation.valueCodeableConcept.text || observation.valueCodeableConcept.coding?.[0]?.display || "-";
                } else if (observation.component && observation.component.length > 0) {

                    const parts = observation.component.map(c => c.valueQuantity?.value).filter(v => v !== undefined);
                    value = parts.join(" / ");
                    unit = observation.component[0]?.valueQuantity?.unit || "";
                } else if (observation.valueString) {
                    value = observation.valueString;
                }

                const category = observation.category?.[0]?.coding?.[0]?.display ||
                    observation.category?.[0]?.coding?.[0]?.code || "-";

                return {
                    id: observation.id,
                    examination: examination,
                    value: value,
                    unit: unit,
                    date: date,
                    status: observation.status || "unknown",
                    category: category,
                    code: observation.code?.coding?.[0]?.code || "-"
                };
            });
    }
}