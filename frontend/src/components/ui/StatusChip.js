import React from "react";
import { Chip } from "@mui/material";

const normalize = (v) => String(v ?? "").trim().toLowerCase();

const deriveActiveFromStatus = (status) => {
    const s = normalize(status);
    if (!s) return null;

    if (["active", "current", "ongoing"].includes(s)) return true;
    if (["resolved", "inactive", "completed", "stopped", "final"].includes(s)) return false;

    return null;
};

class StatusChip extends React.PureComponent {
    render() {
        const {
            status,
            active,
            label,
            size = "small",
            sx,
            ...chipProps
        } = this.props;

        const derived = active ?? deriveActiveFromStatus(status);
        const isActive = derived === true;

        const chipLabel =
            label ??
            (status ? normalize(status) : derived === true ? "active" : derived === false ? "resolved" : "-");

        return (
            <Chip
                size={size}
                label={chipLabel}
                sx={{
                    height: 22,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "lowercase",
                    borderRadius: "8px",
                    bgcolor:
                        derived == null
                            ? "action.disabledBackground"
                            : isActive
                                ? "success.light"
                                : "error.light",
                    color: "common.white",
                    "& .MuiChip-label": { px: 0.9 },
                    ...sx,
                }}
                {...chipProps}
            />
        );
    }
}

export default StatusChip;
