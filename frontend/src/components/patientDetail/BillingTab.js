import React, { useState } from "react";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, Paper,
    TextField, InputAdornment, useTheme, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Grid, Link, Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { lighten, alpha } from "@mui/material/styles";
import StatusChip from "../ui/StatusChip";
import PaginatedTableBody from "../lists/PaginatedTableBody";
import useTableFilter from "../../components/hooks/useTableFilter";

const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const BillingTab = ({ claims = [] }) => {
    const theme = useTheme();
    const { filterText, setFilterText, filteredData } = useTableFilter(claims);

    const [selectedClaim, setSelectedClaim] = useState(null);

    const totalSum = claims.reduce((acc, curr) => acc + curr.amount, 0);
    const currencyCode = claims[0]?.currency || "USD";

    const handleOpen = (claim) => setSelectedClaim(claim);
    const handleClose = () => setSelectedClaim(null);

    return (
        <Box sx={{ p: 3 }}>

            <Paper
                elevation={0}
                sx={{
                    p: 2.5, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    bgcolor: lighten(theme.palette.background.secondary, 0.05),
                    border: `1px solid ${theme.palette.divider}`, borderRadius: '10px'
                }}
            >
                <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {claims.length} Invoices
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Total Billed Amount
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mt: 0.5 }}>
                        {formatCurrency(totalSum, currencyCode)}
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Claims</Typography>
                <TextField
                    size="small" placeholder="Search bills..." value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
                    sx={{ width: 250 }}
                />
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ textAlign: "center" }}>DATE</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>SERVICE / TYPE</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>PROVIDER</TableCell>
                        <TableCell sx={{ textAlign: "center", width: '30%' }}>CLAIM REASON</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>STATUS</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>AMOUNT</TableCell>
                    </TableRow>
                </TableHead>

                <PaginatedTableBody
                    items={filteredData}
                    rowsPerPage={10}
                    colSpan={6}
                    emptyText="No billing records found."
                    resetKey="billing"
                    renderRow={(item, idx) => (
                        <TableRow
                            key={`${item.id}-${idx}`}
                            onClick={() => handleOpen(item)}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,

                                }
                            }}
                        >
                            <TableCell sx={{ textAlign: "left", whiteSpace: 'nowrap', color: theme.palette.text.secondary }}>{item.date}</TableCell>
                            <TableCell sx={{ textAlign: "left", fontWeight: 500 }}>{item.type}</TableCell>
                            <TableCell sx={{ textAlign: "left" }}>{item.provider}</TableCell>

                            <TableCell
                                sx={{
                                    textAlign: !item.diagnosis ? "center" : "left",
                                    color: !item.diagnosis ? theme.palette.text.disabled : "inherit",
                                }}
                            >
                                {item.diagnosis || "-"}
                            </TableCell>


                            <TableCell sx={{ textAlign: "center" }}><StatusChip status={item.status} /></TableCell>

                            <TableCell sx={{ textAlign: "right", fontWeight: 700, color: theme.palette.text.primary }}>
                                {formatCurrency(item.amount, item.currency)}
                            </TableCell>
                        </TableRow>
                    )}
                />
            </Table>

            <Dialog
                open={!!selectedClaim}
                onClose={handleClose}
                maxWidth="sm" fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.secondary,
                        borderRadius: '16px', border: `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                {selectedClaim && (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', bgcolor: lighten(theme.palette.background.secondary, 0.05), pt: 3, pb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                {formatCurrency(selectedClaim.amount, selectedClaim.currency)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                Invoice Date: {selectedClaim.date}
                            </Typography>
                        </DialogTitle>

                        <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
                            <Grid container spacing={2} sx={{ mb: 3, mt: 0 }}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">PROVIDER</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedClaim.provider}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">INSURER / PAYOR</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedClaim.insurer}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">STATUS</Typography>
                                    <Box sx={{ mt: 0.5 }}><StatusChip status={selectedClaim.status} /></Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">TYPE</Typography>
                                    <Typography variant="body1">{selectedClaim.type}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary">PRIMARY DIAGNOSIS</Typography>
                                {selectedClaim.diagnosisCode ? (
                                    <Link
                                        href={`http://snomed.info/id/${selectedClaim.diagnosisCode}`}
                                        target="_blank" rel="noopener noreferrer" underline="hover"
                                        sx={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: theme.palette.primary.main, mt: 0.5 }}
                                    >
                                        {selectedClaim.diagnosis}
                                    </Link>
                                ) : (
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                                        {selectedClaim.diagnosis}
                                    </Typography>
                                )}
                            </Box>

                            {selectedClaim.items && selectedClaim.items.length > 0 && (
                                <Box sx={{ bgcolor: lighten(theme.palette.background.secondary, 0.03), p: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Service Breakdown</Typography>
                                    {selectedClaim.items.map((item, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '0.9rem' }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Typography color="text.secondary">{i + 1}.</Typography>
                                                <Typography color="text.primary">{item.productOrService}</Typography>
                                            </Box>
                                            <Typography fontWeight={600}>
                                                {formatCurrency(item.net, selectedClaim.currency)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                            <Button onClick={handleClose} variant="contained" color="primary">Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default BillingTab;