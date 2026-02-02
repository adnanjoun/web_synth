export class BillingParser {
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
            const id = reference.replace(/^(urn:uuid:|Condition\/|Patient\/|Provider\/|Organization\/|Coverage\/)/, "");
            return resources.find(r => r.id === id);
        };

        return resources
            .filter(resource => resource.resourceType === "Claim")
            .map(claim => {
                const type = claim.type?.coding?.[0]?.display || claim.type?.text || "General Claim";
                const dateRaw = claim.created || claim.billablePeriod?.start;
                const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : "-";
                const amount = claim.total?.value ? parseFloat(claim.total.value) : 0;
                const currency = claim.total?.currency || "USD";
                const status = claim.status || "unknown";

                const providerRef = claim.provider?.reference;
                let providerName = claim.provider?.display || "Unknown Provider";
                if (providerName === "Unknown Provider" && providerRef) {
                    const provRes = findResource(providerRef);
                    providerName = provRes?.name?.text ||
                        (provRes?.name?.[0]?.family ? `${provRes.name[0].given.join(" ")} ${provRes.name[0].family}` : null) ||
                        provRes?.name ||
                        "Unknown Provider";
                }

                let diagnosisLabel = "-";
                let diagnosisCode = null;

                if (claim.diagnosis?.[0]?.diagnosisReference) {
                    const ref = claim.diagnosis[0].diagnosisReference.reference;
                    const condition = findResource(ref);
                    if (condition) {
                        diagnosisLabel = condition.code?.text || condition.code?.coding?.[0]?.display || "Unknown Condition";
                        diagnosisCode = condition.code?.coding?.[0]?.code || null;
                    }
                } else if (claim.diagnosis?.[0]?.diagnosisCodeableConcept) {
                    diagnosisLabel = claim.diagnosis[0].diagnosisCodeableConcept.coding?.[0]?.display || "-";
                    diagnosisCode = claim.diagnosis[0].diagnosisCodeableConcept.coding?.[0]?.code || null;
                }


                let insurerName = "Self-Pay / Unknown";
                if (claim.insurance && claim.insurance.length > 0) {
                    const coverageRef = claim.insurance[0].coverage?.reference;
                    const coverageRes = findResource(coverageRef);
                    if (coverageRes) {
                        const payorRef = coverageRes.payor?.[0]?.reference;
                        const payorDisplay = coverageRes.payor?.[0]?.display;

                        if (payorDisplay) {
                            insurerName = payorDisplay;
                        } else if (payorRef) {
                            const payorRes = findResource(payorRef);
                            insurerName = payorRes?.name || "Unknown Insurer";
                        }
                    }
                }


                const items = (claim.item || []).map(item => {
                    return {
                        sequence: item.sequence,
                        productOrService: item.productOrService?.coding?.[0]?.display || item.productOrService?.text || "Service",
                        code: item.productOrService?.coding?.[0]?.code || null,
                        net: item.net?.value ? parseFloat(item.net.value) : 0
                    };
                });

                return {
                    id: claim.id,
                    type,
                    date,
                    amount,
                    currency,
                    provider: providerName,
                    status,
                    diagnosis: diagnosisLabel,
                    diagnosisCode: diagnosisCode,
                    insurer: insurerName,
                    items: items
                };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}