import { createSlice } from "@reduxjs/toolkit";

type Notification = {
    status: ""|"success"|"error"
    message?: string;
    isVisible: boolean;
};

const initialState: Notification = {
    status:"",
    message:"",
    isVisible: false
};

export const notificationSlice = createSlice({
    name:"notification",
    initialState,
    reducers:{
        setReduxNotification:(state, action) =>{
            state.status = action.payload.status || "";
            state.message = action.payload.message;
            state.isVisible = action.payload.isVisible;
        }
    }
});

export const { setReduxNotification} = notificationSlice.actions

export default notificationSlice.reducer;