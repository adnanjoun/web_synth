export class AllergyParser {
    constructor(bundle) {
        this.bundle = bundle;
    }


    getAll() {
        if (!this.bundle || !this.bundle.entry) {
            return [];
        }

        return this.bundle.entry
            .map(entry => entry.resource)
            .filter(resource => resource.resourceType === "AllergyIntolerance")
            .map(allergy => {
                const substance = allergy.code?.text || allergy.code?.coding?.[0]?.display || "Unknown Substance";

                const code = allergy.code?.coding?.[0]?.code || "-";

                const status = allergy.clinicalStatus?.coding?.[0]?.code || "unknown";

                let reactionText = "-";
                if (Array.isArray(allergy.reaction) && allergy.reaction.length > 0) {
                    const manifestations = allergy.reaction.flatMap(r =>
                        (r.manifestation || []).map(m =>
                            m.coding?.[0]?.display || m.text
                        )
                    );

                    const unique = [...new Set(manifestations.filter(Boolean))];

                    reactionText = unique.length ? unique.join(", ") : "-";
                }

                const category = allergy.category ? allergy.category.join(", ") : "-";

                const recordedDate = allergy.recordedDate
                    ? new Date(allergy.recordedDate).toLocaleDateString()
                    : "-";

                return {
                    id: allergy.id,
                    substance: substance,
                    code: code,
                    status: status,
                    type: allergy.type || "-",
                    category: category,
                    criticality: allergy.criticality || "-",
                    recorded: recordedDate,
                    reaction: reactionText
                };
            });
    }
}