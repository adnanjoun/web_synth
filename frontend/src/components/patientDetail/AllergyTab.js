import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, Link, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import StatusChip from "../ui/StatusChip";
import PaginatedTableBody from "../lists/PaginatedTableBody";
import useTableFilter from "../hooks/useTableFilter";

const AllergyTab = ({ allergies = [] }) => {
    const { filterText, setFilterText, filteredData } = useTableFilter(allergies);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Allergies & Intolerances</Typography>

                <TextField
                    size="small"
                    placeholder="Search allergies..."
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
                        <TableCell>SUBSTANCE</TableCell>
                        <TableCell>CODE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>TYPE</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell>CRITICALITY</TableCell>
                        <TableCell>RECORDED</TableCell>
                        <TableCell>REACTION</TableCell>
                    </TableRow>
                </TableHead>
                <PaginatedTableBody
                    items={filteredData}
                    rowsPerPage={15}
                    colSpan={8}
                    emptyText="No allergies found."
                    resetKey="allergy"
                    renderRow={(a, idx) => (
                        <TableRow key={`${a.id || a.code}-${idx}`} hover>
                            <TableCell sx={{ textAlign: 'left'}}>
                                {a.substance}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`http://snomed.info/id/${a.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                >
                                    {a.code}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <StatusChip status={a.status} />
                            </TableCell>
                            <TableCell>{a.type}</TableCell>
                            <TableCell>{a.category}</TableCell>
                            <TableCell>{a.criticality}</TableCell>
                            <TableCell>{a.recorded}</TableCell>
                            <TableCell sx={{ textAlign: 'left' }}>
                                {a.reaction}</TableCell>
                        </TableRow>
                    )}
                />
            </Table>
        </Box>
    );
};

export default AllergyTab;