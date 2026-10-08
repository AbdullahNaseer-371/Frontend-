import { createSlice } from "@reduxjs/toolkit";

import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../thunks/categoryThunks";

const initialState = {
    categories: [],

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

            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.categories =
                    data?.categories ||
                    data ||
                    [];
            })

            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const category =
                    data?.category ||
                    data;

                if (category) {
                    state.categories.push(category);
                }
            })

            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const updatedCategory =
                    data?.category ||
                    data;

                if (updatedCategory) {
                    const index =
                        state.categories.findIndex(
                            (category) =>
                                category._id ===
                                updatedCategory._id
                        );

                    if (index !== -1) {
                        state.categories[index] =
                            updatedCategory;
                    }
                }
            })

            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.categories =
                    state.categories.filter(
                        (category) =>
                            category._id !==
                            action.payload
                    );
            })

            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCategoryError,
    clearCategorySuccess,
} = categorySlice.actions;

export default categorySlice.reducer;