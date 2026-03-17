import React from "react";
import {
    Box,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    Select,
    FormControl,
    InputLabel,
    OutlinedInput,
    Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const GENDERS = ["male", "female"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 320,
        },
    },
};

const PatientFilterBar = ({ filters, onFilterChange, onReset, availableLocations = [] }) => {
    const handleLocationChange = (event) => {
        const {
            target: { value },
        } = event;
        onFilterChange("locations", typeof value === "string" ? value.split(",") : value);
    };

    const controlSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
                borderWidth: 2,
            },
        },
        "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.75)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "primary.main",
        },
        "& .MuiSvgIcon-root": {
            color: "rgba(255,255,255,0.75)",
        },
        "& input::placeholder": {
            color: "rgba(255,255,255,0.55)",
            opacity: 1,
        },
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    flexWrap: { xs: "wrap", md: "nowrap" },
                }}
            >
                <TextField
                    color="primary"
                    size="small"
                    label="Search Name"
                    placeholder="Search name..."
                    value={filters.name || ""}
                    onChange={(e) => onFilterChange("name", e.target.value)}
                    sx={{ ...controlSx, width: { xs: "100%", md: 320 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    color="primary"
                    select
                    size="small"
                    label="Gender"
                    value={filters.gender || ""}
                    onChange={(e) => onFilterChange("gender", e.target.value)}
                    sx={{ ...controlSx, width: { xs: "100%", md: 150 } }}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {GENDERS.map((g) => (
                        <MenuItem key={g} value={g}>
                            {g}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    color="primary"
                    size="small"
                    label="Min Age"
                    type="number"
                    value={filters.minAge || ""}
                    onChange={(e) => onFilterChange("minAge", e.target.value)}
                    sx={{ ...controlSx, width: { xs: "calc(50% - 6px)", md: 120 } }}
                />

                <TextField
                    color="primary"
                    size="small"
                    label="Max Age"
                    type="number"
                    value={filters.maxAge || ""}
                    onChange={(e) => onFilterChange("maxAge", e.target.value)}
                    sx={{ ...controlSx, width: { xs: "calc(50% - 6px)", md: 120 } }}
                />

                <FormControl
                    color="primary"
                    size="small"
                    sx={{ ...controlSx, width: { xs: "100%", md: 260 } }}
                >
                    <InputLabel>Location</InputLabel>
                    <Select
                        multiple
                        value={filters.locations || []}
                        onChange={handleLocationChange}
                        input={<OutlinedInput label="Location" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.slice(0, 2).map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.14)",
                                            color: "rgba(255,255,255,0.92)",
                                        }}
                                    />
                                ))}
                                {selected.length > 2 && (
                                    <Box sx={{ fontSize: "0.8rem", opacity: 0.85, pl: 0.5 }}>
                                        +{selected.length - 2}
                                    </Box>
                                )}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {availableLocations.map((loc) => (
                            <MenuItem key={loc} value={loc}>
                                {loc}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />

                <Button
                    variant="outlined"
                    size="small"
                    onClick={onReset}
                    startIcon={<ClearIcon />}
                    sx={{
                        borderRadius: 2,
                        height: 40,
                        whiteSpace: "nowrap",
                        borderColor: "primary.main",
                        color: "rgba(255,255,255,0.85)",
                        "&:hover": { borderColor: "primary.main" },
                        width: { xs: "100%", md: "auto" },
                    }}
                >
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default PatientFilterBar;
