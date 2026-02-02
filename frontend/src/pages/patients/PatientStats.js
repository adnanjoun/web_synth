export const AGE_BUCKET_LABELS = [
    "0-9",
    "10-19",
    "20-29",
    "30-39",
    "40-49",
    "50-59",
    "60-69",
    "70-79",
    "80-89",
    "90-99",
    "100+",
];
export function buildGenderDataFromStatistics(statistics) {
    if (!statistics) return [];

    console.log('statistics data: ', statistics);

    const out = [];
    if (statistics.femaleOccurenceCount > 0) {
        out.push({ name: "female", value: statistics.femaleOccurenceCount });
    }
    if (statistics.maleOccurenceCount > 0) {
        out.push({ name: "male", value: statistics.maleOccurenceCount });
    }
    return out;
}


export function buildAgeDataFromStatistics(statistics) {
    const counts = new Array(AGE_BUCKET_LABELS.length).fill(0);

    if (!statistics || !statistics.ageOccurenceData) {
        return mapToChartFormat(counts);
    }

    Object.entries(statistics.ageOccurenceData).forEach(([ageStr, count]) => {
        const age = parseInt(ageStr, 10);
        if (isNaN(age) || age < 0) return;
        const idx = age >= 100 ? 10 : Math.floor(age / 10);

        if (idx < counts.length) {
            counts[idx] += count;
        }
    });

    return mapToChartFormat(counts);
}

function mapToChartFormat(counts) {
    return AGE_BUCKET_LABELS.map((label, i) => ({
        label: label,
        count: counts[i],
    }));
}