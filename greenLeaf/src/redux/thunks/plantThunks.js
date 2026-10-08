import { createAsyncThunk } from "@reduxjs/toolkit";

import plantApi from "../../api/plant.api";

export const fetchPlants = createAsyncThunk(
    "plants/fetchPlants",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await plantApi.getPlants(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load plants"
            );
        }
    }
);

export const fetchPlantById = createAsyncThunk(
    "plants/fetchPlantById",
    async (id, { rejectWithValue }) => {
        try {
            return await plantApi.getPlantById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load plant"
            );
        }
    }
);

export const createPlant = createAsyncThunk(
    "plants/createPlant",
    async (plantData, { rejectWithValue }) => {
        try {
            return await plantApi.createPlant(plantData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create plant"
            );
        }
    }
);

export const updatePlant = createAsyncThunk(
    "plants/updatePlant",
    async ({ id, plantData }, { rejectWithValue }) => {
        try {
            return await plantApi.updatePlant(
                id,
                plantData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update plant"
            );
        }
    }
);

export const deletePlant = createAsyncThunk(
    "plants/deletePlant",
    async (id, { rejectWithValue }) => {
        try {
            await plantApi.deletePlant(id);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete plant"
            );
        }
    }
);