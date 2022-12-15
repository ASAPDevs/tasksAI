import { useState } from "react";
import {
    View,
    Text,
    Heading,
    Pressable,
    Icon
  } from "native-base";
import { StyleSheet } from "react-native";
import { UPDATE_TASK } from "./helpers/mutations";
import { useMutation } from "@apollo/client";
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'; 
import TaskModal from "./TaskModal";


const Task = ({ taskId, title, description, startTime, endTime, completed, refetch }) => {
    const [openTask, toggleOpenTask] = useState(false);

    const [updateTask] = useMutation(UPDATE_TASK, {
      onCompleted: () => {
        refetch()
      },
      onError: (err) => {
        console.log("Error Updating Task: ", err)
      }
    })


    //FOR IMPORTING FONTS ASYNC
   async function loadFonts() {
    await Font.loadAsync({
      Sofia: require("../assets/fonts/sofiapro-light.ttf"),
      FamiljenGrotesk: require('../assets/fonts/FamiljenGrotesk-Regular.ttf'),
      FamiljenBold: require('../assets/fonts/FamiljenGrotesk-SemiBold.ttf')
    });
    updateFonts(true);
  }
  
    return (
      <Pressable 
        onPress={() => toggleOpenTask(true)}
      >
        <View style={styles.taskContainer} key={title}>
          <Heading style={styles.taskHeading}>{title}</Heading>
          <View style={styles.taskContainerTimeContainer}>
            <Text style={{...styles.timeContainerText, ...styles.timeText}}>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            <Text style={styles.timeContainerText}>to</Text>
            <Text style={{...styles.timeContainerText, ...styles.timeText}}>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </View>
          <TaskModal 
            updateTask={updateTask} openTask={openTask} 
            toggleOpenTask={toggleOpenTask} taskTitle={title} 
            taskDescription={description} 
            taskStartTime={startTime} 
            taskEndTime={endTime} 
            taskId={taskId}
            completed={completed}
          />
        </View>
      </Pressable>
    );
  };

  export const DeleteButton = ({item, rowMap, handleDeleteTask}) => {
    const [deleteConfirmation, toggleDeleteConfirmation] = useState(false);
  
      return (
        <View style={styles.deleteTaskContainer}>
          {!deleteConfirmation ? (
          <Pressable onPress={() => {
            toggleDeleteConfirmation(true)
          }}>
            <Icon
              as={MaterialCommunityIcons}
              name="delete"
              color="white"
              size={"8"}
            />
          </Pressable>) :
          <Pressable style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}onPress={() => {
            handleDeleteTask(item.id)
            rowMap[item.key].closeRow()
            toggleDeleteConfirmation(false)
          }}>
            <Text style={{color: 'white'}}>Delete? </Text>
            <Icon
              as={Entypo}
              name="circle-with-cross"
              color="white"
              size={"8"}
            />
          </Pressable>
            }
        </View>
      );
  }

  const styles = StyleSheet.create({
    taskContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: "black",
      borderBottomWidth: 1,
      topBorderWidth: 1,
      padding: 10,
      height: 90,
      
      width: '100%',
      backgroundColor: "white",
      zIndex: 10,
    },
    taskContainerTimeContainer: {
      display: "flex",
      flexDirection: "row",
      fontSize: 17,
      marginTop: 2,
      gap: 15,
      width: '70%',
      alignItems: "center",
      justifyContent: "space-around",
      borderColor: "black",
      borderWidth: 0
    },
    timeContainerText: {
      fontSize: 17,
      textAlign: 'center',
      fontFamily: 'FamiljenBold',
      fontWeight: 'bold'
    },
    timeText: {
      color: '#30C0E3',
      borderColor: 'black',
      borderWidth: 0,
      padding: 3,
      borderRadius: '2%',

    },
    taskHeading: {
      fontSize: 18,
      fontFamily: "FamiljenGrotesk",
      textDecorationLine: "underline"
    },
    deleteTaskContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      borderColor: "black",
      borderWidth: 2,
      padding: 10,
      height: 70,
      margin: 10,
      zIndex: 9,
      backgroundColor: 'red',
      borderRadius: 10,
    },
  });

export default Task;