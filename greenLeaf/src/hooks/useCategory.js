
import { useCallback } from "react";
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

    const categories = normalizeCategories(rawCategories);

    // Fetch categories
    const getCategories = useCallback(
        (params = {}) => {
            return dispatch(fetchCategories(params));
        },
        [dispatch]
    );

    // Add category
    const addCategory = useCallback(
        (categoryData) => {
            return dispatch(createCategory(categoryData));
        },
        [dispatch]
    );

    // Update category
    const editCategory = useCallback(
        (id, categoryData) => {
            return dispatch(
                updateCategory({
                    id,
                    categoryData,
                })
            );
        },
        [dispatch]
    );

    // Delete category
    const removeCategory = useCallback(
        (id) => {
            return dispatch(deleteCategory(id));
        },
        [dispatch]
    );

    // Clear error
    const clearError = useCallback(() => {
        dispatch(clearCategoryError());
    }, [dispatch]);

    // Clear success
    const clearSuccess = useCallback(() => {
        dispatch(clearCategorySuccess());
    }, [dispatch]);

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
