import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// {
//   title: "Test Task Title",
//   description: "Task Description",
//   startTime: 1670547604000,
//   endTime: 1670548888888,
// }

const initialState = {
  username: '',
  user_id: null,
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
    loginUser: (state, action) => {
      state.username = action.payload.username;
      state.user_id = action.payload.user_id;
    },
    logoutUser: (state) => {
      state = initialState
    },
    updateDailyTasks: (state, action) => {
      state.tasks.daily = action.payload
    }
  }
})


export const { loginUser, logoutUser, updateDailyTasks } = storageSlice.actions;
export default storageSlice.reducer;