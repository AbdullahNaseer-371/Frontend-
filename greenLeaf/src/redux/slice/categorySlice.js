
import { createSlice } from "@reduxjs/toolkit";

import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../thunks/categoryThunks";

import {
    normalizeCollection,
    normalizeSingle,
} from "../normalizeResponse";

const initialState = {
    categories: [],

    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },

    loading: false,
    error: null,
    success: false,
};

const categorySlice = createSlice({
    name: "categories",
    initialState,

    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        },

        clearCategorySuccess: (state) => {
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;

                const result = normalizeCollection(
                    action.payload,
                    "categories"
                );

                state.categories = result.items;
                state.pagination = result.pagination;
            })

            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // CREATE
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const category = normalizeSingle(
                    action.payload,
                    "category"
                );

                if (category?._id) {
                    state.categories.unshift(category);
                    state.pagination.total += 1;
                }
            })


            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // UPDATE
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

        .addCase(updateCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            const category = normalizeSingle(
                action.payload,
                "category"
            );

            const index = state.categories.findIndex(
                item => item._id === category?._id
            );

            if (index !== -1) {
                state.categories[index] = category;
            }
        })

            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // DELETE
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const previousLength = state.categories.length;

                state.categories = state.categories.filter(
                    (category) => category._id !== action.payload
                );

                if (state.categories.length < previousLength) {
                    state.pagination.total = Math.max(
                        0,
                        state.pagination.total - 1
                    );
                }
            })

            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            });
    },
});

export const {
    clearCategoryError,
    clearCategorySuccess,
} = categorySlice.actions;

export default categorySlice.reducer;
