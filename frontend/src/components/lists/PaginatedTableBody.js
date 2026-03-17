import React, { useEffect, useMemo, useState } from "react";
import { TableBody, TableRow, TableCell, TablePagination } from "@mui/material";

const PaginatedTableBody = ({
                                items = [],
                                rowsPerPage = 15,
                                colSpan = 1,
                                emptyText = "No data found.",
                                renderRow,
                                showTopPagination = false,
                                showBottomPagination = true,
                                resetKey,
                            }) => {
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (resetKey !== undefined) setPage(0);
    }, [resetKey]);

    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(items.length / rowsPerPage) - 1);
        if (page > maxPage) setPage(0);
    }, [items.length, page, rowsPerPage]);

    const pageItems = useMemo(() => {
        const start = page * rowsPerPage;
        return items.slice(start, start + rowsPerPage);
    }, [items, page, rowsPerPage]);

    const PaginationRow = (
        <TableRow>
            <TableCell colSpan={colSpan} sx={{ p: 0 }}>
                <TablePagination
                    component="div"
                    count={items.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
                    labelRowsPerPage=""
                    sx={{
                        "& .MuiTablePagination-toolbar": {
                            justifyContent: "center",
                            minHeight: 44,
                            px: 1,
                        },
                        "& .MuiTablePagination-spacer": { display: "none" },
                    }}
                />
            </TableCell>
        </TableRow>
    );

    return (
        <TableBody>
            {items.length > 0 && showTopPagination && PaginationRow}

            {items.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={colSpan}>{emptyText}</TableCell>
                </TableRow>
            ) : (
                pageItems.map((item, idx) => renderRow(item, page * rowsPerPage + idx))
            )}

            {items.length > 0 && showBottomPagination && PaginationRow}
        </TableBody>
    );
};

export default PaginatedTableBody;
