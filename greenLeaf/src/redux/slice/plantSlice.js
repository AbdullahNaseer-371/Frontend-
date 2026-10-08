import { createSlice } from "@reduxjs/toolkit";

import {
    fetchPlants,
    fetchPlantById,
    createPlant,
    updatePlant,
    deletePlant,
} from "../thunks/plantThunks";

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

            // GET ALL
            .addCase(fetchPlants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPlants.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.plants =
                    data?.plants ||
                    data ||
                    [];

                if (data?.pagination) {
                    state.pagination =
                        data.pagination;
                }
            })

            .addCase(fetchPlants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET ONE
            .addCase(fetchPlantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPlantById.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.selectedPlant =
                    data?.plant ||
                    data;
            })

            .addCase(fetchPlantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE
            .addCase(createPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createPlant.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const plant =
                    data?.plant ||
                    data;

                if (plant) {
                    state.plants.unshift(plant);
                }
            })

            .addCase(createPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updatePlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updatePlant.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const updatedPlant =
                    data?.plant ||
                    data;

                if (updatedPlant) {
                    const index =
                        state.plants.findIndex(
                            (plant) =>
                                plant._id ===
                                updatedPlant._id
                        );

                    if (index !== -1) {
                        state.plants[index] =
                            updatedPlant;
                    }
                }
            })

            .addCase(updatePlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deletePlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deletePlant.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.plants =
                    state.plants.filter(
                        (plant) =>
                            plant._id !==
                            action.payload
                    );
            })

            .addCase(deletePlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearPlantError,
    clearPlantSuccess,
    clearSelectedPlant,
} = plantSlice.actions;

export default plantSlice.reducer;