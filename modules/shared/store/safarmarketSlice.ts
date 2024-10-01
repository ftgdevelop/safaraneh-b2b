import { createSlice } from "@reduxjs/toolkit";

type SafarmarketHotelPixel = {
    hotel: string;
    flight: string;
};

const initialState: SafarmarketHotelPixel = {
    hotel: "",
    flight: ""
};

export const safarmarketSlice = createSlice({
    name:"safarmarket",
    initialState,
    reducers:{
        setReduxSafarmarketPixel:(state, action) =>{
            if(action.payload.type === "hotel"){            
                state.hotel = action.payload.pixel || undefined;
            }
            if(action.payload.type === "flight"){            
                state.flight = action.payload.pixel || undefined;
            }
        },
        emptyReduxSafarmarket : (state) =>{
            state.flight = "";
            state.hotel = "";
        }
    }
});

export const { setReduxSafarmarketPixel, emptyReduxSafarmarket} = safarmarketSlice.actions

export default safarmarketSlice.reducer;