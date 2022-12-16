import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { View, Text, Progress, Box } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateDailyTasks } from "../redux/slices/storageSlice";
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS, DELETE_TASK } from "./helpers/mutations";
import TaskListContainer from "./TaskListContainer";

const Today = () => {
  // Figure out where we pull date or refetch date
  const [date, setDate] = useState(new Date().toDateString());
  // Need alg to read and determine (completed tasks) / (total tasks)
  const [progress, setProgress] = useState(0);
  const [newTask, openNewTask] = useState(false);

  const tasks = useSelector((state) => state.storage.tasks.daily);
  const userID = useSelector((state) => state.storage.user_id);

  const dispatch = useDispatch();

  //YYYY - MM - DD
  const today = new Date().toISOString().split("T")[0];
  // const todayInMs = new Date(today).getTime();
  // console.log("USER ID: ", userID, typeof userID)

  const { data, error, loading, refetch } = useQuery(GET_TODAYS_TASKS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      dispatch(updateDailyTasks(data.getTasksByDay));
    },
    onError: (error) => {
      console.log("Error in loading tasks: ", error);
    },
    variables: { date: today, user_id: userID },
  });

  const [createTask] = useMutation(CREATE_TASKS, {
    onCompleted: (data) => {
      refetch();
    },
    onError: (err) => {
      console.log("Error Creating Task: ", err);
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.log("Error Deleting Task: ", err);
    },
  });

  // const [updateCompletedTask] = useMutation(COMPLETED_TASK, {
  //   onCompleted: () => {
  //     dispatch(
  //       updateDailyTasks({
  //         /* payload should be tasks from response back from mutation spread with completed switched to false */
  //       })
  //     );
  //     refetch();
  //   },
  //   onError: (err) => {
  //     console.log("Error Updating Completed Task: ", err);
  //   },
  // });

  const handleDeleteTask = (taskId) => {
    deleteTask({
      variables: { taskId: taskId },
    });
  };

  //this handler creates a new task using the current state inputs and sends it to the useMutation function
  //then closes the modal
  const addTask = (taskTitle, taskDescription, startTime, endTime) => {
    const newTask = {
      task_name: taskTitle,
      task_description: taskDescription,
      time_start: startTime.toString(),
      date: new Date().getTime().toString(),
      time_finished: endTime.toString(),
      completed: false,
      user_id: Number(userID),
    };
    createTask({ variables: { task: newTask } });
    openNewTask(false);
  };

  // Call this handler when you complete a task
  const completedTask = () => {
    // useMutation hook call
    updateCompletedTask({
      /* taskInputs with completed switched to true */
    });
  };

  // useEffect to update and render progress bar
  useEffect(() => {
    const completed = tasks.filter((task) => task.completed === true);
    setProgress(((completed.length / tasks.length) * 100).toFixed(2));
  }, [tasks]);



  return (
    <View style={styles.mainContainer}>
      <ImageBackground style={styles.topContainer} resizeMode="cover">
        <View>
          <Text style={styles.topContainerText}>Today:</Text>
          <Text>{date}</Text>
        </View>
        <Box w="50%" p="3" _text={{ textAlign: "center" }}>
          <Progress size="lg" value={progress} />
          <Text> Daily Progress: {progress}%</Text>
        </Box>
      </ImageBackground>
      <TaskListContainer
        addTask={addTask}
        loading={loading}
        newTask={newTask}
        tasks={tasks}
        openNewTask={openNewTask}
        handleDeleteTask={handleDeleteTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    zIndex: -1,
  },
  topContainer: {
    position: "relative",
    top: 120,
    width: "110%",
    borderBottomColor: "black",
    borderWidth: 2,
    maxHeight: 120,
    paddingHorizontal: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topContainerText: {
    fontSize: 30,
    paddingVertical: 18,
    fontFamily: "FamiljenGrotesk",
    // color: "white",
  },
});

export default Today;
