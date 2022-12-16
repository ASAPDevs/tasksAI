import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  View,
  Text,
  Progress,
  Box,
  Divider,
  Icon,
  Heading,
  IconButton,
  Pressable,
  Button,
} from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { ImageBackground, StyleSheet, ActivityIndicator } from "react-native";
import banner from "../assets/banner.jpg";
import { useSelector, useDispatch } from "react-redux";
import {updateDailyTasks} from '../redux/slices/storageSlice'
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS, DELETE_TASK } from "./helpers/mutations";
import Task, { DeleteButton } from "./Task";
import NewTaskModal from "./NewTaskModal";
import { SwipeListView } from "react-native-swipe-list-view";
import { render } from "react-dom";


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
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
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

  // // This data is needed to use for SwipeListView
  // const swipeListData = tasks.map((task, index) => ({
  //   ...task,
  //   key: index
  // }))

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
      <TaskListContainer addTask={addTask} loading={loading} newTask={newTask} tasks={tasks} openNewTask={openNewTask} handleDeleteTask={handleDeleteTask} />
    </View>
  );
};

const TaskListContainer = ({addTask, tasks, refetch, openNewTask, newTask, handleDeleteTask, loading}) => {
  //Selected Tab/View for the container
  //Default is "inprogress", other two are "completed" and "all"
  const [currentTab, switchTab] = useState('inprogress')


   // This data is needed to use for SwipeListView
   const swipeListData = tasks.map((task, index) => ({
    ...task,
    key: index
  }))

  const swipeListDataInProgress = tasks.filter((task, index) => {
    return task.completed === false
  }).map((task, index) => ({
    ...task,
    key: index
  }))

  const swipeDataCompleted = tasks.filter((task, index) => {
    return task.completed === true
  }).map((task, index) => ({
    ...task,
    key: index
  }))


  //THIS FUNCTION CONDITIONALLY RENDERS THE SELECTED TAB
  const tabRender = () => {
    switch(currentTab) {
      case 'inprogress':
        return (<SwipeListView style={styles.taskListContainer} 
          data={swipeListDataInProgress}
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
        />
        )
      case 'completed':
        return (<SwipeListView style={styles.taskListContainer} 
          data={swipeDataCompleted}
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
        />
        )
      case 'all':
        return (<SwipeListView style={styles.taskListContainer} 
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
        />
        )
    }
  }


  return (
    <View style={styles.bottomContainer}>
    <View style={{minHeight: '4%'}}>
      <Heading style={styles.bottomContainerHeading}>Task List</Heading>
      <TaskListTabGroup currentTab={currentTab} switchTab={switchTab} />
      <Divider bgColor="black" thickness={1} orientation="horizontal"/>
    </View>
    {/* Fallback Loading for Tasks List */}
    {loading && <View style={{height: '55%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" /></View>}
    {/* Tasks List */}
    {!loading && tabRender()}
    <View style={styles.createTaskButtonContainer}>
    <Pressable
        onPress={() => openNewTask(true)}
        style={{...styles.createTaskButton}}
      >
        <Text style={{fontFamily: 'FamiljenGrotesk', fontWeight: 'bold', textAlign: 'center', fontSize: 18}}>CREATE A NEW TASK</Text>
      </Pressable>
    </View>
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
  )
}

const TaskListTabGroup = ({currentTab, switchTab}) => {

  useEffect(() => {

  }, [currentTab])
  
  return (
    <Button.Group colorScheme="grey" variant="ghost" isAttached  size="sm" style={{ top: 4, position: 'absolute', right: 50}}>
      <IconButton
      onPress={() => switchTab('inprogress')} 
      icon={<Icon color={currentTab === 'inprogress' ? 'orange.400' : 'grey'} 
      as={MaterialCommunityIcons} 
      name="progress-clock" size={5}/>} />

      <IconButton 
       onPress={() => switchTab('completed')}
      icon={<Icon color={currentTab === 'completed' ? 'orange.400' : 'grey'}  
      as={MaterialCommunityIcons} name="progress-check" size={5}/>} />
      <Button 
       onPress={() => switchTab('all')}
      _text={{
        color: `${currentTab == 'all' ? 'orange.400' : 'grey'}`
      }}
      fontFamily="FamiljenGrotesk" >All</Button>
    </Button.Group>
  )
}

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
    width: "110%",
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
    paddingTop: 0,
    display: 'flex',
    alignContent: "center",
    flexDirection: "column",
    
    // bottom: 600,
    // left: -214,
    // height: 100,
    width: "120%",
  },
  bottomContainerHeading: {
    fontFamily: "FamiljenGrotesk",
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 5,
    
    marginBottom: 10,
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
    height: '55%',
  },
  createTaskButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: -110,
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  createTaskButton: {
    borderColor: 'black', borderWidth: 1, paddingTop: 5, backgroundColor: 'orange',
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  }
});

export default Today;
