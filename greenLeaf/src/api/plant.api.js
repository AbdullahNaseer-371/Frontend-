import api from "./axios.api";

const plantApi = {
    createPlant: async (plantData) => {
        const response = await api.post(
            "/plants",
            plantData
        );

        return response.data;
    },

    getPlants: async (params = {}) => {
        const response = await api.get("/plants", {
            params,
        });

        return response.data;
    },

    getPlantById: async (id) => {
        const response = await api.get(
            `/plants/${id}`
        );

        return response.data;
    },

    updatePlant: async (id, plantData) => {
        const response = await api.put(
            `/plants/${id}`,
            plantData
        );

        return response.data;
    },

    deletePlant: async (id) => {
        const response = await api.delete(
            `/plants/${id}`
        );

        return response.data;
    },
};

export default plantApi;