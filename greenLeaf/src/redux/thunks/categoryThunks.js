import { createAsyncThunk } from "@reduxjs/toolkit";

import categoryApi from "../../api/category.api";

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await categoryApi.getCategories(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load categories"
            );
        }
    }
);

export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            return await categoryApi.createCategory(
                categoryData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create category"
            );
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            return await categoryApi.updateCategory(
                id,
                categoryData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update category"
            );
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await categoryApi.deleteCategory(id);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    }
);