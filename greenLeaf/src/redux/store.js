import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slice/authSlice";
import plantReducer from "./slice/plantSlice";
import saleReducer from "./slice/saleSlice";
import categoryReducer from "./slice/categorySlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        plants: plantReducer,
        sales: saleReducer,
        categories: categoryReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: true,
        }),

    // devTools: import.meta.env.MODE !== "production",
});

export default store;