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

    const {
        sales,
        selectedSale,
        report,
        pagination,

        loading,
        reportLoading,

        error,
        reportError,

        success,
    } = useSelector((state) => state.sales);

    const getSales = (params = {}) => {
        return dispatch(fetchSales(params));
    };

    const getSale = (id) => {
        return dispatch(fetchSaleById(id));
    };

    const addSale = (saleData) => {
        return dispatch(createSale(saleData));
    };

    const editSale = (id, saleData) => {
        return dispatch(
            updateSale({
                id,
                saleData,
            })
        );
    };

    const removeSale = (id) => {
        return dispatch(deleteSale(id));
    };

    const getSalesReport = (params = {}) => {
        return dispatch(
            fetchSalesReport(params)
        );
    };

    const clearError = () => {
        dispatch(clearSaleError());
    };

    const clearReportError = () => {
        dispatch(clearReportError());
    };

    const clearSuccess = () => {
        dispatch(clearSaleSuccess());
    };

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