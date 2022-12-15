import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  View,
  Text,
  Progress,
  Box,
  Heading,
  Pressable,
  ScrollView,
  FlatList
} from "native-base";
import { ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import banner from "../assets/banner.jpg";
import { useSelector, useDispatch } from "react-redux";
import {updateDailyTasks} from '../redux/slices/storageSlice'
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS, DELETE_TASK } from "./helpers/mutations";
import * as Font from "expo-font";
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
        <Heading style={styles.bottomContainerHeading}>Task List </Heading>

        <SwipeListView style={styles.taskListContainer} 
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

          rightOpenValue={-190}
          
          // onRightActionStatusChange={() => {
          //   console.log('Deleted')
          // }}
          // rightActivationValue={-100}
        />

        <Pressable
            onPress={() => openNewTask(true)}
            style={{...styles.taskContainer, backgroundColor: 'orange'}}
          >
            <Text style={{fontFamily: 'FamiljenBold', fontWeight: 'bold', textAlign: 'center'}}>CREATE A NEW TASK</Text>
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
    alignItems: "center",
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
    fontFamily: "FamiljenGrotesk"
    // color: "white",
  },
  bottomContainer: {
    // borderColor: "cyan",
    // borderWidth: 3,
    position: "relative",
    top: 120,
    paddingTop: 20,
    display: 'flex',
    alignContent: "center",
    flexDirection: "column",
    justifyContent: 'center',
    // bottom: 600,
    // left: -214,
    // height: 100,
    width: "120%",
  },
  bottomContainerHeading: {
    fontFamily: "FamiljenGrotesk",
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    alignItems: 'center',
    borderWidth: 0,
    padding: 10,
    height: 70,
    margin: 10,
    borderRadius: 10,
  },
  taskListContainer: {
    borderColor: 'black',
    borderWidth: 2,
    height: '50%',
  },
  btn: {
    position: "absolute",
    bottom: 100,
    right: "50%",
  },
});

export default Today;
