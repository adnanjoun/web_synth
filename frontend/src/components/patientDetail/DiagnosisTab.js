import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, Link, TextField, InputAdornment } from "@mui/material"; // TextField & InputAdornment dazu
import SearchIcon from '@mui/icons-material/Search';
import StatusChip from "../ui/StatusChip";
import PaginatedTableBody from "../lists/PaginatedTableBody";
import useTableFilter from "../hooks/useTableFilter";

const DiagnosisTab = ({ conditions = [] }) => {
    const { filterText, setFilterText, filteredData } = useTableFilter(conditions);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Diagnoses</Typography>

                <TextField
                    size="small"
                    placeholder="Search diagnoses..."
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
                        <TableCell>DIAGNOSE</TableCell>
                        <TableCell>CODE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>BEGIN</TableCell>
                        <TableCell>END</TableCell>
                        <TableCell>PRACTITIONER</TableCell>
                    </TableRow>
                </TableHead>
                <PaginatedTableBody
                    items={filteredData}
                    rowsPerPage={15}
                    colSpan={6}
                    emptyText="No diagnoses found."
                    resetKey={"diagnosis"}
                    renderRow={(c, i) => (
                        <TableRow key={`${c.id || c.code}-${i}`} hover>
                            <TableCell sx={{ textAlign: 'left' }}>
                                {c.diagnosis}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'left' }}>
                                <Link href={`http://snomed.info/id/${c.code}`} target="_blank" rel="noopener noreferrer">
                                    {c.code}
                                </Link>
                            </TableCell>
                            <TableCell><StatusChip status={c.status} /></TableCell>
                            <TableCell>{c.begin}</TableCell>
                            <TableCell>{c.end}</TableCell>
                            <TableCell sx={{ textAlign: 'left' }}>
                                {c.practitioner}</TableCell>
                        </TableRow>
                    )}
                />
            </Table>
        </Box>
    );
};

export default DiagnosisTab;