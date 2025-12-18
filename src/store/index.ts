// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (gDM) => gDM().concat(api.middleware),
});

// ⬇️ WAJIB TAMBAH INI
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
