import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:null
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
        },
    }
})

export const { setAuthUser, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;
