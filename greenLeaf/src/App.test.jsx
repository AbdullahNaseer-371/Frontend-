
import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import App from "./App";
import authReducer from "./redux/slice/authSlice";
import plantReducer from "./redux/slice/plantSlice";
import saleReducer from "./redux/slice/saleSlice";
import categoryReducer from "./redux/slice/categorySlice";

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      plants: plantReducer,
      sales: saleReducer,
      categories: categoryReducer,
    },
  });

const renderApp = () =>
  render(
    <Provider store={createTestStore()}>
      <App />
    </Provider>
  );

describe("GreenLeaf Application Tests", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the application without crashing", () => {
    renderApp();
    expect(document.body).toBeInTheDocument();
  });

  it("creates the Redux store successfully", () => {
    const store = createTestStore();

    expect(store.getState()).toHaveProperty("auth");
    expect(store.getState()).toHaveProperty("plants");
    expect(store.getState()).toHaveProperty("sales");
    expect(store.getState()).toHaveProperty("categories");
  });

  it("initializes authentication state", () => {
    expect(createTestStore().getState().auth).toBeDefined();
  });

  it("initializes plant state", () => {
    expect(createTestStore().getState().plants).toBeDefined();
  });

  it("initializes sales state", () => {
    expect(createTestStore().getState().sales).toBeDefined();
  });

  it("initializes category state", () => {
    expect(createTestStore().getState().categories).toBeDefined();
  });
});
