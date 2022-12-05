import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  username: 'Jackie',
  avatar: '',
  tasks: {
    daily: [],
    weekly: [],
    yearly: [],
    all: [],
  },
  recommendations: [],
  settings: {
    darkMode: false,
  }
}


export const storageSlice = createSlice({
  name: 'Storage',
  initialState,
  reducers: {
    updateUsername: (state, action) => {
      state.username = action.payload;
    }
  }
})


export const {updateUsername} = storageSlice.actions;
export default storageSlice.reducer;