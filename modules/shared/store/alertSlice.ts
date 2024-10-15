import { createSlice } from "@reduxjs/toolkit";

type Alert = {
    type?:"success" | "error";
    title?: string;
    message?: string;
    isVisible: boolean;
    closeAlertLink?: string;
    closeButtonText?:string;
};

const initialState: Alert = {
    type: undefined,
    title:"",
    message:"",
    isVisible: false
};

export const alertSlice = createSlice({
    name:"alertModal",
    initialState,
    reducers:{
        setAlertModal:(state, action) =>{
            state.title = action.payload.title || "";
            state.type = action.payload.type || undefined;
            state.message = action.payload.message;
            state.isVisible = action.payload.isVisible;
            state.closeAlertLink = action.payload.closeAlertLink;
            state.closeButtonText = action.payload.closeButtonText;
        }
    }
});

export const { setAlertModal} = alertSlice.actions

export default alertSlice.reducer;