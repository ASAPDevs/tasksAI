import { configureStore } from "@reduxjs/toolkit";
import storageReducer from './slices/storageSlice'


const store = configureStore({
	reducer: {
		storage: storageReducer
	},
})


export default store;
