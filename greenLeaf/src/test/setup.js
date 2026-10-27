
import "@testing-library/jest-dom";
import { vi } from "vitest";

const storage = new Map();

const mockStorage = {
    getItem: vi.fn((key) =>
        storage.has(key) ? storage.get(key) : null
    ),
    setItem: vi.fn((key, value) => {
        storage.set(key, String(value));
    }),
    removeItem: vi.fn((key) => {
        storage.delete(key);
    }),
    clear: vi.fn(() => {
        storage.clear();
    }),
};

vi.stubGlobal("localStorage", mockStorage);
