import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isLoading: false,
    notifications:[],
    error: null,
}
const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },
        setNotifications(state,action){
            state.notifications = action.payload;
        },
        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
       
    }
});
export default slice.reducer;
export const {setNotifications} = slice.actions;
