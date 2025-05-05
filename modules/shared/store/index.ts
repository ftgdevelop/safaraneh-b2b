import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import notificationSlice from "./notificationSlice";
import domesticHotelSlice from "@/modules/domesticHotel/store/domesticHotelSlice";
import stylesSlice from "./stylesSlice";
import authenticationSlice from "@/modules/authentication/store/authenticationSlice";
import safarmarketSlice from "./safarmarketSlice";
import flightSlice from "@/modules/flights/store/flightsSlice";

export const store = configureStore({
    reducer: {
        alert: alertSlice,
        notification: notificationSlice,
        domesticHotelFilter: domesticHotelSlice,
        styles: stylesSlice,
        authentication: authenticationSlice,
        flightFilters: flightSlice,
        safarmarket: safarmarketSlice
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch