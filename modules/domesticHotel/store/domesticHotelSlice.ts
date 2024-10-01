import { createSlice } from "@reduxjs/toolkit";

type DomesticHotel = {
    filterOptions:{
        typeFilterOptions: {label:string, id:number, count: number}[],
        facilityFilterOptions: {label:string, keyword:string, count: number}[],
        promotionFilterOptions: {label:string, keyword:string, count: number}[],
        guestPointFilterOptions: {label:string, value:[number, number], count: number}[],
        priceFilterRange?: {min: number, max:number}
    }
};

const initialState: DomesticHotel = {
    filterOptions:{
        typeFilterOptions: [],
        facilityFilterOptions:[],
        promotionFilterOptions:[],
        guestPointFilterOptions: []
    }
};

export const domesticHotelSlice = createSlice({
    name: "domesticHotel",
    initialState,
    reducers: {
        setTypeFilterOptions: (state, action)=>{
            state.filterOptions.typeFilterOptions = action.payload
        },
        setFacilityFilterOptions: (state, action)=>{
            state.filterOptions.facilityFilterOptions = action.payload
        },
        setPromotionsFilterOptions: (state, action)=>{
            state.filterOptions.promotionFilterOptions = action.payload
        },
        setGuestPointFilterOptions: (state, action)=>{
            state.filterOptions.guestPointFilterOptions = action.payload
        },
        setPriceFilterRange: (state, action:{payload:{min: number, max:number}})=>{
            state.filterOptions.priceFilterRange = action.payload
        }
    }
});

export const { setFacilityFilterOptions, setPromotionsFilterOptions,setGuestPointFilterOptions, setPriceFilterRange, setTypeFilterOptions } = domesticHotelSlice.actions

export default domesticHotelSlice.reducer;