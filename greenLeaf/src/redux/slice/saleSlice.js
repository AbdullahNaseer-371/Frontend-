import { createSlice } from "@reduxjs/toolkit";

import {
    fetchSales,
    fetchSaleById,
    createSale,
    updateSale,
    deleteSale,
    fetchSalesReport,
} from "../thunks/saleThunks";

import {
    normalizeCollection,
    normalizeSingle,
    normalizeReport,
} from "../normalizeResponse";

const initialState = {
    sales: [],
    selectedSale: null,

    report: null,

    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },

    loading: false,
    reportLoading: false,

    error: null,
    reportError: null,

    success: false,
};

const saleSlice = createSlice({
    name: "sales",
    initialState,

    reducers: {
        clearSaleError: (state) => {
            state.error = null;
        },

        clearReportError: (state) => {
            state.reportError = null;
        },

        clearSaleSuccess: (state) => {
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH SALES
            .addCase(fetchSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSales.fulfilled, (state, action) => {
                state.loading = false;

                const result = normalizeCollection(
                    action.payload,
                    "sales"
                );

                state.sales = result.items;
                state.pagination = result.pagination;
            })

            .addCase(fetchSales.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // FETCH SINGLE SALE
            .addCase(fetchSaleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSaleById.fulfilled, (state, action) => {
                state.loading = false;

                state.selectedSale = normalizeSingle(
                    action.payload,
                    "sale"
                );
            })

            .addCase(fetchSaleById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // CREATE SALE
            .addCase(createSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const sale = normalizeSingle(
                    action.payload,
                    "sale"
                );

                if (sale?._id) {
                    state.sales.unshift(sale);
                    state.pagination.total += 1;
                }
            })

            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // UPDATE SALE
            .addCase(updateSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const sale = normalizeSingle(
                    action.payload,
                    "sale"
                );

                const index = state.sales.findIndex(
                    item => item._id === sale?._id
                );

                if (index !== -1) {
                    state.sales[index] = sale;
                }
            })

            .addCase(updateSale.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // DELETE SALE
            .addCase(deleteSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const exists = state.sales.some(
                    (item) => item._id === action.payload
                );

                state.sales = state.sales.filter(
                    (item) => item._id !== action.payload
                );

                if (exists) {
                    state.pagination.total = Math.max(
                        0,
                        state.pagination.total - 1
                    );
                }

                if (
                    state.selectedSale?._id === action.payload
                ) {
                    state.selectedSale = null;
                }
            })

            .addCase(deleteSale.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // FETCH SALES REPORT
            .addCase(fetchSalesReport.pending, (state) => {
                state.reportLoading = true;
                state.reportError = null;
            })

            .addCase(fetchSalesReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.report = normalizeReport(action.payload);
            })

            .addCase(fetchSalesReport.rejected, (state, action) => {
                state.reportLoading = false;
                state.reportError =
                    action.payload || action.error.message;
            })
    },
});

export const {
    clearSaleError,
    clearReportError,
    clearSaleSuccess,
} = saleSlice.actions;

export default saleSlice.reducer;
