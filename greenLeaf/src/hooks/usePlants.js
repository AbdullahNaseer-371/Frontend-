import { useDispatch, useSelector } from "react-redux";

import {
    fetchPlants,
    fetchPlantById,
    createPlant,
    updatePlant,
    deletePlant,
} from "../redux/thunks/plantThunks";

import {
    clearPlantError,
    clearPlantSuccess,
    clearSelectedPlant,
} from "../redux/slice/plantSlice";

const usePlants = () => {
    const dispatch = useDispatch();

    const {
        plants,
        selectedPlant,
        pagination,
        loading,
        error,
        success,
    } = useSelector((state) => state.plants);

    const getPlants = (params = {}) => {
        return dispatch(fetchPlants(params));
    };

    const getPlant = (id) => {
        return dispatch(fetchPlantById(id));
    };

    const addPlant = (plantData) => {
        return dispatch(createPlant(plantData));
    };

    const editPlant = (id, plantData) => {
        return dispatch(
            updatePlant({
                id,
                plantData,
            })
        );
    };

    const removePlant = (id) => {
        return dispatch(deletePlant(id));
    };

    const clearError = () => {
        dispatch(clearPlantError());
    };

    const clearSuccess = () => {
        dispatch(clearPlantSuccess());
    };

    const clearSelected = () => {
        dispatch(clearSelectedPlant());
    };

    return {
        plants,
        selectedPlant,
        pagination,

        loading,
        error,
        success,

        getPlants,
        getPlant,
        addPlant,
        editPlant,
        removePlant,

        clearError,
        clearSuccess,
        clearSelected,
    };
};

export default usePlants;