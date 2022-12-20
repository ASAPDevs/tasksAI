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
  loggedIn: false,
  avatar: '',
  tasks: {
    all: [],
    completed: [],
    progress: [],
    // completedLength: completed.length,
    // inprogressLength: progress.length
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
    updateDailyTasks: (state, action) => {
      // state.tasks.all = action.payload
      state.tasks.all = action.payload.map((task) => ({...task, key: task.id}))
      state.tasks.completed = state.tasks.all.filter(task => task.completed)
      state.tasks.progress = state.tasks.all.filter(task => !task.completed)
    }
  }
})


export const { loginUser, logoutUser, updateDailyTasks } = storageSlice.actions;
export default storageSlice.reducer;