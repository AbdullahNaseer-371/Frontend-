
import { createSlice } from "@reduxjs/toolkit";

import {
    fetchPlants,
    fetchPlantById,
    createPlant,
    updatePlant,
    deletePlant,
} from "../thunks/plantThunks";

import {
    normalizeCollection,
    normalizeSingle,
} from "../normalizeResponse";

const initialState = {
    plants: [],
    selectedPlant: null,

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

const plantSlice = createSlice({
    name: "plants",
    initialState,

    reducers: {
        clearPlantError: (state) => {
            state.error = null;
        },

        clearPlantSuccess: (state) => {
            state.success = false;
        },

        clearSelectedPlant: (state) => {
            state.selectedPlant = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH PLANTS
            .addCase(fetchPlants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlants.fulfilled, (state, action) => {
                state.loading = false;

                const result = normalizeCollection(
                    action.payload,
                    "plants"
                );

                state.plants = result.items;
                state.pagination = result.pagination;
            })

            .addCase(fetchPlants.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // FETCH SINGLE PLANT
            .addCase(fetchPlantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPlantById.fulfilled, (state, action) => {
                state.loading = false;

                state.selectedPlant = normalizeSingle(
                    action.payload,
                    "plant"
                );
            })

            .addCase(fetchPlantById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // CREATE PLANT
            .addCase(createPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createPlant.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const plant = normalizeSingle(
                    action.payload,
                    "plant"
                );

                if (plant?._id) {
                    state.plants.unshift(plant);
                    state.pagination.total += 1;
                }
            })

            .addCase(createPlant.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // UPDATE PLANT
            .addCase(updatePlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updatePlant.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const plant = normalizeSingle(
                    action.payload,
                    "plant"
                );

                const index = state.plants.findIndex(
                    item => item._id === plant?._id
                );

                if (index !== -1) {
                    state.plants[index] = plant;
                }
            })

            .addCase(updatePlant.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            })

            // DELETE PLANT
            .addCase(deletePlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlant.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.plants = state.plants.filter(
                    plant => plant._id !== action.payload
                );

                state.pagination.total = Math.max(
                    0,
                    state.pagination.total - 1
                );
            })

            .addCase(deletePlant.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || action.error.message;
            });
    },
});

export const {
    clearPlantError,
    clearPlantSuccess,
    clearSelectedPlant,
} = plantSlice.actions;

export default plantSlice.reducer;
