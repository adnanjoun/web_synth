import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Link
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import StatusChip from "../ui/StatusChip";

const CarePlanTab = ({ carePlans = [] }) => {
    const theme = useTheme();
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleOpen = (plan) => setSelectedPlan(plan);
    const handleClose = () => setSelectedPlan(null);

    if (!carePlans || carePlans.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    No care plans found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Care Plans
            </Typography>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(220px, 1fr))' },
                gap: '18px',
                alignItems: 'stretch'
            }}>
                {carePlans.map((plan, index) => (
                    <Paper
                        key={plan.id || index}
                        elevation={0}
                        onClick={() => handleOpen(plan)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',

                            bgcolor: lighten(theme.palette.background.secondary, 0.07),
                            border: `1px solid ${theme.palette.divider || '#5a5a5a'}`,
                            borderRadius: '10px',
                            p: '14px 14px 12px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                borderColor: theme.palette.primary.main
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                            <Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.2, mb: 0.5 }}>
                                    {plan.title}
                                </Typography>
                                <Typography sx={{ fontSize: '11px', color: theme.palette.text.secondary }}>
                                    Period: {plan.period}
                                </Typography>
                            </Box>
                            <StatusChip status={plan.status} />
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                            {plan.activities && plan.activities.length > 0 && (
                                <>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: theme.palette.text.primary, mb: 0.8 }}>
                                        Activities:
                                    </Typography>
                                    <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '11px', color: theme.palette.text.secondary, '& li': { mb: 0.5, lineHeight: 1.25 } }}>
                                        {plan.activities.slice(0, 2).map((act, i) => (
                                            <li key={i}>{act}</li>
                                        ))}
                                        {plan.activities.length > 2 && (
                                            <li>... (+{plan.activities.length - 2} more)</li>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Box>

            <Dialog
                open={!!selectedPlan}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.secondary,
                        backgroundImage: 'none',
                        borderRadius: '16px',
                        border: `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                {selectedPlan && (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', bgcolor: theme.palette.background.secondary, pt: 3, pb: 1 }}>
                            {selectedPlan.code ? (
                                <Link
                                    href={`http://snomed.info/id/${selectedPlan.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.25rem',
                                        color: theme.palette.primary.main,
                                        display: 'block'
                                    }}
                                >
                                    {selectedPlan.title}
                                </Link>
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                    {selectedPlan.title}
                                </Typography>
                            )}

                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                {selectedPlan.period}
                            </Typography>
                        </DialogTitle>

                        <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}>
                                <StatusChip status={selectedPlan.status} size="medium" />

                                {selectedPlan.addresses && (
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                        Treats Condition: <b>{selectedPlan.addresses}</b>
                                    </Typography>
                                )}
                            </Box>

                            {selectedPlan.goals && selectedPlan.goals.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        letterSpacing: '1px',
                                        mb: 1
                                    }}>
                                        Target Goals
                                    </Typography>
                                    <Box sx={{
                                        bgcolor: lighten(theme.palette.background.secondary, 0.05),
                                        p: 2,
                                        borderRadius: '8px',
                                        border: `1px solid ${theme.palette.divider}`
                                    }}>
                                        <Box component="ul" sx={{ m: 0, pl: 2, color: theme.palette.text.primary, '& li': { mb: 0.5 } }}>
                                            {selectedPlan.goals.map((goal, i) => (
                                                <li key={i}>{goal}</li>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            <Box>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '1px',
                                    mb: 1
                                }}>
                                    Detailed Activities
                                </Typography>
                                {selectedPlan.activities && selectedPlan.activities.length > 0 ? (
                                    <Box component="ul" sx={{
                                        m: 0, pl: 2.5,
                                        color: theme.palette.text.primary,
                                        fontSize: '0.95rem',
                                        '& li': { mb: 1, lineHeight: 1.5 }
                                    }}>
                                        {selectedPlan.activities.map((act, i) => (
                                            <li key={i}>{act}</li>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography sx={{ color: theme.palette.text.secondary }}>No activities listed.</Typography>
                                )}
                            </Box>

                        </DialogContent>

                        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default CarePlanTab;