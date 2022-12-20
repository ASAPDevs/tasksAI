import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  username: '',
  user_id: null,
  loggedIn: false,
  avatar: '',
  tasks: {
    all: [],
    completed: [],
    progress: [],
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
      state.loggedIn = true;
    },
    logoutUser: (state) => {
      state = initialState
    },
    loadTasks: (state, action) => {
      state.tasks.all = action.payload.map((task) => ({...task, key: task.id}))
    },
    updateTasks: (state, action) => {
      state.tasks.all = state.tasks.all.filter(task => task.id !== action.payload)
      
    }
  }
})


export const { loginUser, logoutUser, loadTasks, updateTasks } = storageSlice.actions;
export default storageSlice.reducer;