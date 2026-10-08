import { createSlice } from "@reduxjs/toolkit";

import {
    fetchSales,
    fetchSaleById,
    createSale,
    updateSale,
    deleteSale,
    fetchSalesReport,
} from "../thunks/saleThunks";

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

            // SALES
            .addCase(fetchSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSales.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.sales =
                    data?.sales ||
                    data ||
                    [];

                if (data?.pagination) {
                    state.pagination =
                        data.pagination;
                }
            })

            .addCase(fetchSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // SALE BY ID
            .addCase(fetchSaleById.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchSaleById.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.selectedSale =
                    data?.sale ||
                    data;
            })

            .addCase(fetchSaleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE
            .addCase(createSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const sale =
                    data?.sale ||
                    data;

                if (sale) {
                    state.sales.unshift(sale);
                }
            })

            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updateSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const updatedSale =
                    data?.sale ||
                    data;

                if (updatedSale) {
                    const index =
                        state.sales.findIndex(
                            (sale) =>
                                sale._id ===
                                updatedSale._id
                        );

                    if (index !== -1) {
                        state.sales[index] =
                            updatedSale;
                    }
                }
            })

            .addCase(updateSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deleteSale.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.sales =
                    state.sales.filter(
                        (sale) =>
                            sale._id !==
                            action.payload
                    );
            })

            .addCase(deleteSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // REPORT
            .addCase(fetchSalesReport.pending, (state) => {
                state.reportLoading = true;
                state.reportError = null;
            })

            .addCase(fetchSalesReport.fulfilled, (state, action) => {
                state.reportLoading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.report = data;
            })

            .addCase(fetchSalesReport.rejected, (state, action) => {
                state.reportLoading = false;
                state.reportError = action.payload;
            });
    },
});

export const {
    clearSaleError,
    clearReportError,
    clearSaleSuccess,
} = saleSlice.actions;

export default saleSlice.reducer;