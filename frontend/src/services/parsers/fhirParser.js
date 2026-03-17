export class FhirPatientParser {
    constructor(bundle, index) {
        this.bundle = bundle;
        this.index = index;
        this.patientResource = bundle.entry?.find((e) => e.resource.resourceType === "Patient")?.resource;
    }

    getBasicInfo() {
        if (!this.patientResource) return null;

        const r = this.patientResource;

        const nameEntry = r.name ? r.name[0] : {};
        const fullName = `${nameEntry.given ? nameEntry.given.join(" ") : ""} ${nameEntry.family || ""}`.trim();

        const birthDate = r.birthDate;
        let age = "Unknown";
        if (birthDate) {
            const birth = new Date(birthDate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                calculatedAge--;
            }
            age = calculatedAge;
        }


        const phoneEntry = r.telecom?.find(t => t.system === 'phone');
        const emailEntry = r.telecom?.find(t => t.system === 'email');


        let addressStr = "-";
        if (r.address && r.address.length > 0) {
            const a = r.address[0];
            const lines = a.line ? a.line.join(", ") : "";
            addressStr = `${lines}, ${a.postalCode || ""} ${a.city || ""}, ${a.state || ""}`.replace(/,\s*,/, ",");
        }


        const ssnEntry = r.identifier?.find(id => id.type?.coding?.some(c => c.code === "SS"));
        const mrnEntry = r.identifier?.find(id => id.type?.coding?.some(c => c.code === "MR"));

        return {
            id: r.id,
            name: fullName,
            gender: r.gender,
            birthDate: r.birthDate,
            age: age,

            location: addressStr,
            address: addressStr,
            telecom: phoneEntry ? phoneEntry.value : "-",
            email: emailEntry ? emailEntry.value : "-",
            communication: r.communication?.[0]?.language?.text || "-",
            maritalStatus: r.maritalStatus?.text || "-",
            ssn: ssnEntry ? ssnEntry.value : "-",
            mrn: mrnEntry ? mrnEntry.value : "-",
        };
    }
}