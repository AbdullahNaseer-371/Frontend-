
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchSales,
    fetchSaleById,
    createSale,
    updateSale,
    deleteSale,
    fetchSalesReport,
} from "../redux/thunks/saleThunks";

import {
    clearSaleError,
    clearReportError,
    clearSaleSuccess,
} from "../redux/slice/saleSlice";

const useSales = () => {
    const dispatch = useDispatch();

    // Redux state
    const {
        sales = [],
        selectedSale = null,
        report = null,
        pagination = {},

        loading = false,
        reportLoading = false,

        error = null,
        reportError = null,

        success = false,
    } = useSelector((state) => state.sales);

    // Fetch all sales
    const getSales = useCallback(
        (params = {}) => {
            return dispatch(fetchSales(params));
        },
        [dispatch]
    );

    // Fetch single sale
    const getSale = useCallback(
        (id) => {
            return dispatch(fetchSaleById(id));
        },
        [dispatch]
    );

    // Create sale
    const addSale = useCallback(
        (saleData) => {
            return dispatch(createSale(saleData));
        },
        [dispatch]
    );

    // Update sale
    const editSale = useCallback(
        (id, saleData) => {
            return dispatch(
                updateSale({
                    id,
                    saleData,
                })
            );
        },
        [dispatch]
    );

    // Delete sale
    const removeSale = useCallback(
        (id) => {
            return dispatch(deleteSale(id));
        },
        [dispatch]
    );

    // Fetch sales report
    const getSalesReport = useCallback(
        (params = {}) => {
            return dispatch(fetchSalesReport(params));
        },
        [dispatch]
    );

    // Clear sales error
    const clearError = useCallback(() => {
        dispatch(clearSaleError());
    }, [dispatch]);

    // Clear report error
    const clearReportError = useCallback(() => {
        dispatch(clearReportError());
    }, [dispatch]);

    // Clear success message
    const clearSuccess = useCallback(() => {
        dispatch(clearSaleSuccess());
    }, [dispatch]);

    return {
        sales,
        selectedSale,
        report,
        pagination,

        loading,
        reportLoading,

        error,
        reportError,

        success,

        getSales,
        getSale,
        addSale,
        editSale,
        removeSale,

        getSalesReport,

        clearError,
        clearReportError,
        clearSuccess,
    };
};

export default useSales;
