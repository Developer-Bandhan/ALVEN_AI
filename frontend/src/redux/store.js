import { configureStore } from '@reduxjs/toolkit'
import authSlice from './suthSlice'

const store = configureStore({
    reducer: {
        auth: authSlice
    }
});

export default store;