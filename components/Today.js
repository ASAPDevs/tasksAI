import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  View,
  Text,
  Progress,
  Box,
  Heading,
  Pressable,
} from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import banner from "../assets/banner.jpg";
import { useSelector, useDispatch } from "react-redux";
import {updateDailyTasks} from '../redux/slices/storageSlice'
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS } from "./helpers/mutations";
import Task from "./Task";
import NewTaskModal from "./NewTaskModal";


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
  const today = new Date().toISOString().split('T')[0];
  console.log('today', today);
  // const todayInMs = new Date(today).getTime();
  // console.log("USER ID: ", userID, typeof userID)

  const { data, error, loading, refetch } = useQuery(GET_TODAYS_TASKS, {
    onCompleted: (data) => {
      // console.log('after useQuery', data.getTasksByDay)
      dispatch(updateDailyTasks(data.getTasksByDay))
    },
    onError: (error) => {
      console.log("Error in loading tasks: ", error);
    },
    //make dynamic
    variables: {date: today, user_id: userID}
  });
  
  const [createTask] = useMutation(CREATE_TASKS, {
    onCompleted: (data) => {
      refetch();
    },
    onError: (err) => {
      console.log("Error Creating Task: ", err)
    }
  })


  const addTask = (taskTitle, taskDescription, startTime, endTime) => {
    const newTask = {
      task_name: taskTitle,
      task_description: taskDescription,
      time_start: startTime.toString(),
      // date: todayInMs.toString(),
      date: new Date().getTime().toString(),
      time_finished: endTime.toString(),
      completed: false,
      user_id: Number(userID)
    };
    createTask({variables: {task: newTask}})
    openNewTask(false);
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        style={styles.topContainer}
        // source={banner}
        resizeMode="cover"
      >
        <View>
          <Text style={styles.topContainerText}>Today:</Text>
          <Text>{date}</Text>
        </View>
        <Box w="50%" p="3" _text={{ textAlign: "center" }}>
          <Progress size="lg" value={progress} />
          <Text> Daily Progress: {progress}%</Text>
        </Box>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <Heading>Tasks:</Heading>
        <Box style={styles.box}>
          {tasks.map((task, index) => (
            <Task
              description={task.task_description}
              title={task.task_name}
              startTime={task.time_start}
              completed={task.completed}
              endTime={task.time_finished}
              key={task.id}
            />
          ))}
          <Pressable
            onPress={() => openNewTask(true)}
            style={styles.taskContainer}
          >
            <Text>Create a new task..</Text>
          </Pressable>
          {newTask ? (
            <NewTaskModal
              addTask={addTask}
              newTask={newTask}
              openNewTask={openNewTask}
            />
          ) : (
            ""
          )}
        </Box>
      </View>
      {/* <Button onPress={() => addTask()} style={styles.btn}>
        +
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    // flexDirection: "row",
    // textAlign: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    // borderColor: "green",
    // borderWidth: 3,
    // maxWidth: "100%",
    zIndex: -1,
  },
  topContainer: {
    // bottom: 700,
    // left: -214,
    position: "relative",
    top: 120,
    width: "100%",
    borderBottomColor: "black",
    borderWidth: 2,
    maxHeight: 120,
    paddingHorizontal: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "red",
    alignItems: "center",
  },
  topContainerText: {
    fontSize: 30,
    paddingVertical: 18,
    // color: "white",
  },
  bottomContainer: {
    // borderColor: "cyan",
    // borderWidth: 3,
    position: "relative",
    top: 120,
    // bottom: 600,
    // left: -214,
    // height: 100,
    width: "100%",
  },
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    height: 70,
    margin: 10,
    borderRadius: 10,
  },
  btn: {
    position: "absolute",
    bottom: 100,
    right: "50%",
  },
  box: {
    // height: 400,
    position: "relative",
    // bottom: 100,
    // bottom: 600,
    display: "flex",
    flexDirection: "column",
  },
});

export default Today;
