import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { Group } from "@mui/icons-material";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const GENDER_COLORS = {
    female: "#ff6bcb",
    male: "#3498db",
};

export default function PatientsCharts({ totalPopulation, genderData, ageData, theme }) {
    return (
        <Grid2 container spacing={3} sx={{ mb: 4, alignItems: "stretch" }}>
            {/* Population */}
            <Grid2 xs={12} md={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 300,
                        minHeight: 300,
                    }}
                >
                    <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Group sx={{ fontSize: 60 }} />
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            {totalPopulation}
                        </Typography>
                        <Typography variant="subtitle1">Population</Typography>
                    </Box>
                </Paper>
            </Grid2>

            {/* Gender */}
            <Grid2 xs={12} md={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        height: "100%",
                        minWidth: 300,
                        minHeight: 300,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Gender
                    </Typography>

                    <Box sx={{ flexGrow: 1, minHeight: 140 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {genderData.map((entry) => (
                                        <Cell key={entry.name} fill={GENDER_COLORS[entry.name] || "#999"} />
                                    ))}
                                </Pie>

                                <Tooltip
                                    contentStyle={{ backgroundColor: "rgba(255,255,255,1)", borderRadius: 8, color: "#111" }}
                                    labelStyle={{ color: "#111", fontWeight: 600 }}
                                    itemStyle={{ color: "#111" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid2>

            {/* Age */}
            <Grid2 xs={12} md={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        height: "100%",
                        minWidth: 385,
                        minHeight: 300,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Age
                    </Typography>

                    <Box sx={{ flexGrow: 1, minHeight: 140 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <XAxis dataKey="label" tick={{ fill: theme.palette.primary.contrastText }} />
                                <YAxis allowDecimals={false} tick={{ fill: theme.palette.primary.contrastText }} />
                                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} labelStyle={{ color: "#fff" }} />
                                <Bar dataKey="count" fill={theme.palette.primary.contrastText} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid2>
        </Grid2>
    );
}
