
import { useDispatch, useSelector } from "react-redux";

import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../redux/thunks/categoryThunks";

import {
    clearCategoryError,
    clearCategorySuccess,
} from "../redux/slice/categorySlice";

// Normalize API/Redux category response into an array
const normalizeCategories = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (!value || typeof value !== "object") {
        return [];
    }

    if (Array.isArray(value.categories)) {
        return value.categories;
    }

    if (Array.isArray(value.data)) {
        return value.data;
    }

    if (Array.isArray(value.data?.categories)) {
        return value.data.categories;
    }

    if (Array.isArray(value.data?.data)) {
        return value.data.data;
    }

    if (Array.isArray(value.data?.data?.categories)) {
        return value.data.data.categories;
    }

    return [];
};

const useCategories = () => {
    const dispatch = useDispatch();

    const {
        categories: rawCategories,
        loading,
        error,
        success,
    } = useSelector((state) => state.categories);

    // Always return an array
    const categories = normalizeCategories(rawCategories);

    const getCategories = (params = {}) => {
        return dispatch(fetchCategories(params));
    };

    const addCategory = (categoryData) => {
        return dispatch(createCategory(categoryData));
    };

    const editCategory = (id, categoryData) => {
        return dispatch(
            updateCategory({
                id,
                categoryData,
            })
        );
    };

    const removeCategory = (id) => {
        return dispatch(deleteCategory(id));
    };

    const clearError = () => {
        dispatch(clearCategoryError());
    };

    const clearSuccess = () => {
        dispatch(clearCategorySuccess());
    };

    return {
        categories,
        loading,
        error,
        success,
        getCategories,
        addCategory,
        editCategory,
        removeCategory,
        clearError,
        clearSuccess,
    };
};

export default useCategories;
