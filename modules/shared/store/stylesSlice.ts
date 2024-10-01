import { createSlice } from "@reduxjs/toolkit";

type StylesInfo = {
    bodyScrollable: boolean;
    headerUnderMain: boolean;
    progressLoading : boolean;
};

const initialState: StylesInfo = {
    bodyScrollable: true,
    headerUnderMain: false,
    progressLoading: false
};

export const stylesSlice = createSlice({
    name: "styles",
    initialState,
    reducers: {
        setBodyScrollable: (state, action) => {
            state.bodyScrollable = action.payload;
        },
        setHeaderUnderMain: (state, action) => {
            state.headerUnderMain = action.payload;
        },
        setProgressLoading: (state, action) => {
            state.progressLoading = action.payload;
        }
    }
});

export const { setBodyScrollable, setHeaderUnderMain , setProgressLoading} = stylesSlice.actions

export default stylesSlice.reducer;