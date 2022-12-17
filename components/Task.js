import React, { useState } from "react";
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


  
  
    return (
      <Pressable 
        onPress={() => toggleOpenTask(true)}
      >
        <View style={styles.taskContainer} key={title}>
          <View style={styles.taskContainerInnerWrapper}>
            <Heading style={styles.taskHeading}>{title}</Heading>
            <View style={styles.taskContainerTimeContainer}>
              <Text style={{...styles.timeContainerText, ...styles.timeText}}>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              <Text style={styles.timeContainerText}>to</Text>
              <Text style={{...styles.timeContainerText, ...styles.timeText}}>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            </View>
            <View style={styles.swipeRightIcon}>
              <Icon as={Entypo} name="chevron-small-right" size={5} />
            </View>
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
          <Pressable style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onPress={() => {
            toggleDeleteConfirmation(true)
          }}>
            <Text style={{color: 'white'}}>Delete </Text>
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
            <Text style={{color: 'white'}}>Are you sure? </Text>
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: "black",
      borderBottomWidth: 1,
      topBorderWidth: 1,
      padding: 10,
      height: 90,
      
      width: '100%',
      backgroundColor: "white",
      zIndex: 10,
    },
    taskContainerInnerWrapper: {
      display: 'flex',
      width: '80%',
      borderColor: 'red',
      borderWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
    },
    taskContainerTimeContainer: {
      display: "flex",
      flexDirection: "column",
      fontSize: 17,
      marginTop: 2,
      gap: 20,
      height: '110%',
      width: '25%',
      alignItems: "center",
      justifyItems: 'center',
      justifyContent: "space-around",
      borderColor: "black",
      borderWidth: 0,
      marginRight: 5
    },
    timeContainerText: {
      fontSize: 17,
      textAlign: 'center',
      fontFamily: 'FamiljenBold',
      fontWeight: 'bold'
    },
    timeText: {
      color: '#0B486B',
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
      borderBottomWidth: 1,
      topBorderWidth: 1,
      padding: 10,
      paddingRight: 30,
      height: 90,
      width: '95%',
      zIndex: 9,
      backgroundColor: 'red',
      borderRadius: 10,
    },
    swipeRightIcon: {
      position: "absolute",
      right: -18.5
    }
  });

export default React.memo(Task);