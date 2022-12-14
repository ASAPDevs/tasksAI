import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  View,
  Text,
  Progress,
  Box,
  Heading,
  Pressable,
} from "native-base";
import { ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import banner from "../assets/banner.jpg";
import { useSelector, useDispatch } from "react-redux";
import {updateDailyTasks} from '../redux/slices/storageSlice'
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS, DELETE_TASK } from "./helpers/mutations";
import Task, { DeleteButton } from "./Task";
import NewTaskModal from "./NewTaskModal";
import { SwipeListView } from "react-native-swipe-list-view";

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

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      refetch()
    },
    onError: (err) => {
      console.log("Error Deleting Task: ", err)
    }
  })

  const handleDeleteTask = (taskId) => {
    deleteTask({
      variables: { taskId: taskId }
    })
  }

  const addTask = (taskTitle, taskDescription, startTime, endTime) => {
    const newTask = {
      task_name: taskTitle,
      task_description: taskDescription,
      time_start: startTime.toString(),
      date: new Date().getTime().toString(),
      time_finished: endTime.toString(),
      completed: false,
      user_id: Number(userID)
    };
    createTask({variables: {task: newTask}})
    openNewTask(false);
  };

  // This data is needed to use for SwipeListView
  const swipeListData = tasks.map((task, index) => ({
    ...task,
    key: index
  }))

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

        <SwipeListView style={styles.box} 
          data={swipeListData}
          renderItem={({ item }, rowMap) => {
            return (
              <Task
                description={item.task_description}
                title={item.task_name}
                startTime={item.time_start}
                completed={item.completed}
                endTime={item.time_finished}
                taskId={item.id}
                key={item.id}
                refetch={refetch}
              />
            )
          }}

          renderHiddenItem={({ item }, rowMap) => {
            return (
              <DeleteButton item={item} rowMap={rowMap} handleDeleteTask={handleDeleteTask} 
              />
            )
          }}

          rightOpenValue={-100}
          
          // onRightActionStatusChange={() => {
          //   console.log('Deleted')
          // }}
          // rightActivationValue={-100}
        />
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
      </View>
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
