import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, Link, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import StatusChip from "../ui/StatusChip";
import PaginatedTableBody from "../lists/PaginatedTableBody";
import useTableFilter from "../../components/hooks/useTableFilter";


const ExaminationTab = ({ examinations = [] }) => {
    const { filterText, setFilterText, filteredData } = useTableFilter(examinations);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Examinations & Vitals
                </Typography>

                <TextField
                    size="small"
                    placeholder="Search examinations..."
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
                        <TableCell>EXAMINATION</TableCell>
                        <TableCell>VALUE</TableCell>
                        <TableCell>UNIT</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell>CODE</TableCell>
                    </TableRow>
                </TableHead>

                <PaginatedTableBody
                    items={filteredData}
                    rowsPerPage={15}
                    colSpan={7}
                    emptyText="No examinations found."
                    resetKey="examination"
                    renderRow={(item, idx) => (
                        <TableRow key={`${item.id || item.code}-${idx}`} hover>
                            <TableCell sx={{ textAlign: "left", fontWeight: 500 }}>
                                {item.examination || "-"}
                            </TableCell>
                            <TableCell>
                                {item.value !== undefined ? item.value : "-"}
                            </TableCell>
                            <TableCell>
                                {item.unit || ""}
                            </TableCell>
                            <TableCell>
                                {item.date || "-"}
                            </TableCell>
                            <TableCell>
                                <StatusChip status={item.status} />
                            </TableCell>
                            <TableCell>
                                {item.category || "-"}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'left' }}>
                                <Link
                                    href={`http://loinc.org/${item.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                >
                                    {item.code}
                                </Link>
                            </TableCell>
                        </TableRow>
                    )}
                />
            </Table>
        </Box>
    );
};

export default ExaminationTab;