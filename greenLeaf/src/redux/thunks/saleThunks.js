import { createAsyncThunk } from "@reduxjs/toolkit";

import saleApi from "../../api/sale.api";

export const fetchSales = createAsyncThunk(
    "sales/fetchSales",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await saleApi.getSales(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sales"
            );
        }
    }
);

export const fetchSaleById = createAsyncThunk(
    "sales/fetchSaleById",
    async (id, { rejectWithValue }) => {
        try {
            return await saleApi.getSaleById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sale"
            );
        }
    }
);

export const createSale = createAsyncThunk(
    "sales/createSale",
    async (saleData, { rejectWithValue }) => {
        try {
            return await saleApi.createSale(saleData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create sale"
            );
        }
    }
);

export const updateSale = createAsyncThunk(
    "sales/updateSale",
    async ({ id, saleData }, { rejectWithValue }) => {
        try {
            return await saleApi.updateSale(
                id,
                saleData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update sale"
            );
        }
    }
);

export const deleteSale = createAsyncThunk(
    "sales/deleteSale",
    async (id, { rejectWithValue }) => {
        try {
            await saleApi.deleteSale(id);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete sale"
            );
        }
    }
);

export const fetchSalesReport = createAsyncThunk(
    "sales/fetchSalesReport",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await saleApi.getSalesReport(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sales report"
            );
        }
    }
);