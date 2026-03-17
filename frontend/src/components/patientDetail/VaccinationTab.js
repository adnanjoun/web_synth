import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import StatusChip from "../ui/StatusChip";
import PaginatedTableBody from "../lists/PaginatedTableBody";
import useTableFilter from "../hooks/useTableFilter";

const VaccinationTab = ({ vaccinations = [] }) => {
    const { filterText, setFilterText, filteredData } = useTableFilter(vaccinations);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Vaccinations
                </Typography>

                <TextField
                    size="small"
                    placeholder="Search vaccinations..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 250 }}
                />
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>VACCINE</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>PRACTITIONER</TableCell>
                    </TableRow>
                </TableHead>

                <PaginatedTableBody
                    items={filteredData}
                    rowsPerPage={15}
                    colSpan={4}
                    emptyText="No vaccinations found."
                    resetKey="vaccination"
                    renderRow={(v, idx) => (
                        <TableRow key={`${v.id || v.vaccine}-${idx}`} hover>
                            <TableCell sx={{ textAlign: "left" }}>{v.vaccine || "-"}</TableCell>
                            <TableCell>{v.date || "-"}</TableCell>
                            <TableCell>
                                <StatusChip status={v.status} />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                {v.practitioner || "-"}</TableCell>
                        </TableRow>
                    )}
                />
            </Table>
        </Box>
    );
};

export default VaccinationTab;