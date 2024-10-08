import { createSlice } from "@reduxjs/toolkit";
import { UserInformation } from "../types/authentication";

type Authentication = {
    authenticationDone: boolean;
    isAuthenticated: boolean;
    getUserLoading: boolean;
    user?: UserInformation | undefined;
    balance?: number;
    balanceLoading? : boolean;
    loginFormIsOpen?: boolean;
    loginToContinueReserve?: boolean;
    permissions?: string[];
};

const initialState: Authentication = {
    authenticationDone: false,
    isAuthenticated: false,
    getUserLoading: false,
    user: undefined,
    balance: undefined,
    balanceLoading: false,
    loginFormIsOpen: false,
    loginToContinueReserve:false,
    permissions: undefined
};

export const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setReduxUser: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
            state.getUserLoading = action.payload.getUserLoading;
        },
        setReduxBalance: (state, action) => {
            state.balance = action.payload.balance;
            state.balanceLoading = action.payload.loading;
        },
        openLoginForm : (state) =>{
            state.loginFormIsOpen = true;
        },
        closeLoginForm : (state) =>{
            state.loginFormIsOpen = false;
        },
        setLoginToContinueReserve:(state, action) => {
            state.loginToContinueReserve = action.payload;
        },
        setAuthenticationDone: (state) => {
            state.authenticationDone = true;
        },
        setUserPermissions : (state, action) => {
            state.permissions = action.payload;
        }

    }
});

export const { setReduxUser,setUserPermissions, setReduxBalance,setAuthenticationDone, closeLoginForm, openLoginForm , setLoginToContinueReserve} = authenticationSlice.actions

export default authenticationSlice.reducer;