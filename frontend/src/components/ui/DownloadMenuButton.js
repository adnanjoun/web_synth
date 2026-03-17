import React, { useState } from "react";
import { Button, Menu, MenuItem, ListItemText } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const DEFAULT_FORMATS = [
    { value: "csv", label: "Download CSV " },
    { value: "fhir", label: "Download FHIR (JSON)" },
];

const DownloadMenuButton = ({
                                label,
                                variant = "outlined",
                                startIcon,
                                disabled = false,
                                formats = DEFAULT_FORMATS,
                                onSelect,
                                buttonSx,
                            }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelect = (format) => {
        handleClose();
        if (onSelect) onSelect(format);
    };

    return (
        <>
            <Button
                variant={variant}
                startIcon={startIcon}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleOpen}
                disabled={disabled}
                sx={buttonSx}
            >
                {label}
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {formats.map((f) => (
                    <MenuItem key={f.value} onClick={() => handleSelect(f.value)}>
                        <ListItemText primary={f.label} />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default DownloadMenuButton;
