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

const useCategories = () => {
    const dispatch = useDispatch();

    const {
        categories,
        loading,
        error,
        success,
    } = useSelector(
        (state) => state.categories
    );

    const getCategories = (params = {}) => {
        return dispatch(
            fetchCategories(params)
        );
    };

    const addCategory = (categoryData) => {
        return dispatch(
            createCategory(categoryData)
        );
    };

    const editCategory = (
        id,
        categoryData
    ) => {
        return dispatch(
            updateCategory({
                id,
                categoryData,
            })
        );
    };

    const removeCategory = (id) => {
        return dispatch(
            deleteCategory(id)
        );
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