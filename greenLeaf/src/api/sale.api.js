import api from "./axios.api";

const saleApi = {
    createSale: async (saleData) => {
        const response = await api.post(
            "/sales",
            saleData
        );

        return response.data;
    },

    getSales: async (params = {}) => {
        const response = await api.get("/sales", {
            params,
        });

        return response.data;
    },

    getSaleById: async (id) => {
        const response = await api.get(
            `/sales/${id}`
        );

        return response.data;
    },

    updateSale: async (id, saleData) => {
        const response = await api.put(
            `/sales/${id}`,
            saleData
        );

        return response.data;
    },

    deleteSale: async (id) => {
        const response = await api.delete(
            `/sales/${id}`
        );

        return response.data;
    },

    getSalesReport: async (params = {}) => {
        const response = await api.get(
            "/sales/report",
            {
                params,
            }
        );

        return response.data;
    },
};

export default saleApi;