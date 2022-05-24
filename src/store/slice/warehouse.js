import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isLoading: false,
    warehouse:{},
    error: null,
}
const slice = createSlice({
    name: 'warehouse',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },
        setWarehouse(state,action){
            state.warehouse = action.payload;
        },
        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
       
    }
});
export default slice.reducer;
export const {setWarehouse} = slice.actions;
