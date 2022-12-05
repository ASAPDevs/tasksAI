import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  username: 'Jackie'
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