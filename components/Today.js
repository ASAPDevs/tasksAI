import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { View, Text, Progress, Box, Pressable } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateDailyTasks } from "../redux/slices/storageSlice";
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS, DELETE_TASK } from "./helpers/mutations";
import { FontAwesome } from "@expo/vector-icons";
import TaskListContainer from "./TaskListContainer";
import Calendar from "./Calendar";

const Today = () => {
  // Figure out where we pull date or refetch date
  const [date, setDate] = useState(new Date());
  // Need alg to read and determine (completed tasks) / (total tasks)
  const [progress, setProgress] = useState(0);
  const [newTask, openNewTask] = useState(false);
  const [calendarModal, openCalendarModal] = useState(false);
  // const [tasks, setTasks] = useState(useSelector((state) => state.storage.tasks.daily));

  const tasks = useSelector((state) => state.storage.tasks.daily);
  const userID = useSelector((state) => state.storage.user_id);

  const dispatch = useDispatch();

  //YYYY - MM - DD
  // const today = new Date().toISOString().split("T")[0];
  // const todayInMs = new Date(today).getTime();
  // console.log("USER ID: ", userID, typeof userID)

  const { data, error, loading, refetch } = useQuery(GET_TODAYS_TASKS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      dispatch(updateDailyTasks(data.getTasksByDay)); // update redux toolkit state
    },
    onError: (error) => {
      console.log("Error in loading tasks: ", error);
    },
    variables: { date: date.toISOString().split('T')[0], user_id: userID },
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

  // this function converts the date state to mm/dd/yy format

  const convertDateTitle = () => {
    const yy = date.getFullYear();
    const mm = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${mm}/${dd}/${yy % 100}`;
  }

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
      date: date.getTime().toString(),
      time_finished: endTime.toString(),
      completed: true,
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
    console.log(date)
    const completed = tasks.filter((task) => task.completed === true);
    setProgress(((completed.length / tasks.length) * 100).toFixed(2));
  }, [tasks]);


  return (
    <View style={styles.mainContainer}>
      <ImageBackground style={styles.topContainer} resizeMode="cover">
        <View>
          <Text style={styles.topContainerText}>{convertDateTitle()}</Text>
          <Pressable onPress={() => openCalendarModal(true)} style={styles.calendarRow}>
            <FontAwesome name="calendar" size={24} color="white" />
          </Pressable>
        </View>
        <Box w="50%" p="3" _text={{ textAlign: "center" }}>
          <Progress size="xl" value={progress} />
          <Text style={styles.progressText}> Daily Progress: {progress == NaN ? progress : '0.00'}%</Text>
        </Box>
      </ImageBackground>
      <Calendar
        calendarModal={calendarModal}
        openCalendarModal={openCalendarModal}
        setDate={setDate}
        date={date}
      />
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
    width: "100%",
    height: "100%",
    alignItems: "center",
    zIndex: -1,
  },
  topContainer: {
    width: "110%",
    borderBottomColor: "black",
    borderWidth: 1,
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
  calendarRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'orange',
    backgroundColor: 'orange'
  },
  progressText: {
    fontSize: 13,
    paddingTop: 4
  }
});

export default Today;
