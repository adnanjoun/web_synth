import { useState, useMemo, useCallback } from "react";

const useTableFilter = (data = []) => {
    const [filterText, setFilterText] = useState("");
    const [filters, setFilters] = useState({});

    const setFilter = useCallback((key, value) => {
        setFilters((prev) => {
            const next = { ...prev, [key]: value };
            return next;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({});
        setFilterText("");
    }, []);

    const filteredData = useMemo(() => {
        let result = Array.isArray(data) ? data : [];

        if (Object.keys(filters).length > 0) {
            result = result.filter((item) => {
                return Object.entries(filters).every(([key, filterValue]) => {
                    if (filterValue === "" || filterValue === null || filterValue === undefined) return true;

                    const itemValue = item?.[key];

                    if (key === "minAge") return (Number(item?.age) || 0) >= Number(filterValue);
                    if (key === "maxAge") return (Number(item?.age) || 0) <= Number(filterValue);

                    if (key === "locations") {
                        if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
                        return filterValue.some(v => String(v).toLowerCase() === String(item.locations).toLowerCase());
                    }

                    if (Array.isArray(filterValue)) {
                        if (filterValue.length === 0) return true;
                        if (itemValue === null || itemValue === undefined) return false;
                        return filterValue.some(
                            (v) => String(v).toLowerCase() === String(itemValue).toLowerCase()
                        );
                    }

                    if (key === "gender") {
                        if (itemValue === null || itemValue === undefined) return false;
                        return String(itemValue).toLowerCase() === String(filterValue).toLowerCase();
                    }

                    if (typeof itemValue === "string") {
                        return itemValue.toLowerCase().includes(String(filterValue).toLowerCase());
                    }

                    return itemValue === filterValue;
                });
            });
        }

        if (filterText) {
            const lowerFilter = filterText.toLowerCase();
            result = result.filter((item) => {
                return Object.values(item || {}).some((val) => {
                    if (val === null || val === undefined) return false;
                    return String(val).toLowerCase().includes(lowerFilter);
                });
            });
        }

        return result;
    }, [data, filters, filterText]);

    return {
        filterText,
        setFilterText,
        filters,
        setFilter,
        resetFilters,
        filteredData,
    };
};

export default useTableFilter;
