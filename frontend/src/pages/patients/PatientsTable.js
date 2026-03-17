import React, { useMemo } from "react";
import {
    Box,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    IconButton,
    Typography,
} from "@mui/material";
import { FavoriteBorder, Favorite, Visibility } from "@mui/icons-material";

export default function PatientsTable({
                                          patients,
                                          totalElements,
                                          page,
                                          pageSize,
                                          selectedSet,
                                          onToggleSelected,
                                          onToggleSelectAllVisible,
                                          onToggleFavorite,
                                          onViewDetails,
                                      }) {
    const visiblePatients = useMemo(() => patients || [], [patients]);

    const visibleSelectedCount = useMemo(() => {
        let c = 0;
        for (const p of visiblePatients) if (selectedSet.has(p.id)) c += 1;
        return c;
    }, [visiblePatients, selectedSet]);

    const allVisibleChecked = visiblePatients.length > 0 && visibleSelectedCount === visiblePatients.length;
    const visibleIndeterminate = visibleSelectedCount > 0 && visibleSelectedCount < visiblePatients.length;

    const from = totalElements ? (page - 1) * pageSize + 1 : 0;
    const to = totalElements ? Math.min(page * pageSize, totalElements) : 0;

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={visibleIndeterminate}
                                    checked={allVisibleChecked}
                                    onChange={(e) => onToggleSelectAllVisible(visiblePatients, e.target.checked)}
                                />
                            </TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Gender</TableCell>
                            <TableCell align="center">Age</TableCell>
                            <TableCell align="center">Location</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {visiblePatients.map((patient, index) => {
                            const checked = selectedSet.has(patient.id);
                            return (
                                <TableRow key={patient.id || index} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={checked}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleSelected(patient.id);
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell style={{ textAlign: "left" }}>
                                        {(page - 1) * pageSize + index + 1}. {patient.name}
                                    </TableCell>

                                    <TableCell align="center">{patient.gender}</TableCell>

                                    <TableCell align="center">
                                        {patient.age}
                                        {typeof patient.age === "number" ? " years" : ""}
                                    </TableCell>

                                    <TableCell align="center">{patient.location}</TableCell>

                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => onToggleFavorite(patient)}>
                                            {patient.isFavorite ? <Favorite color="primary" /> : <FavoriteBorder />}
                                        </IconButton>

                                        <IconButton size="small" onClick={() => onViewDetails(patient.id)}>
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    {totalElements ? `Showing ${from}-${to} of ${totalElements}` : `Showing ${visiblePatients.length}`}
                </Typography>
            </Box>
        </Box>
    );
}
