export class CarePlanParser {
    constructor(bundle) {
        this.bundle = bundle;
    }

    getAll() {
        if (!this.bundle || !this.bundle.entry) {
            return [];
        }

        const resources = this.bundle.entry.map(e => e.resource);

        const findResource = (reference) => {
            if (!reference) return null;
            const id = reference.replace(/^(urn:uuid:|Condition\/|Goal\/)/, "");
            return resources.find(r => r.id === id);
        };

        return resources
            .filter(resource => resource.resourceType === "CarePlan")
            .map(plan => {

                const codeObj = plan.category?.[0]?.coding?.[0] || plan.code?.coding?.[0];
                const title = codeObj?.display || plan.category?.[0]?.text || "General Care Plan";
                const snomedCode = codeObj?.code || null;

                const start = plan.period?.start ? new Date(plan.period.start).toLocaleDateString() : "Unknown";
                const end = plan.period?.end ? new Date(plan.period.end).toLocaleDateString() : "ongoing";
                const periodString = `${start} - ${end}`;

                let addressesLabel = null;
                if (plan.addresses && plan.addresses.length > 0) {
                    const condition = findResource(plan.addresses[0].reference);
                    if (condition) {
                        addressesLabel = condition.code?.text || condition.code?.coding?.[0]?.display || "Unknown Condition";
                    }
                }

                let goalsList = [];
                if (plan.goal && plan.goal.length > 0) {
                    goalsList = plan.goal.map(gRef => {
                        const goalRes = findResource(gRef.reference);
                        return goalRes?.description?.text || null;
                    }).filter(Boolean);
                }

                const activities = (plan.activity || []).map(act => {
                    const description = act.detail?.code?.coding?.[0]?.display ||
                        act.detail?.code?.text ||
                        act.detail?.description ||
                        "Unnamed Activity";

                    const performer = act.detail?.performer?.[0]?.display
                        ? ` - ${act.detail.performer[0].display}`
                        : "";

                    return `${description}${performer}`;
                });

                return {
                    id: plan.id,
                    title: title,
                    code: snomedCode,
                    period: periodString,
                    status: plan.status || "unknown",
                    activities: activities,
                    addresses: addressesLabel,
                    goals: goalsList
                };
            });
    }
}