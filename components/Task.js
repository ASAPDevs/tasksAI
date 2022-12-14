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
  
    return (
      <Pressable 
        onPress={() => toggleOpenTask(true)}
      >
        <View style={styles.taskContainer} key={title}>
          <Heading style={styles.taskHeading}>{title}</Heading>
          <View style={styles.taskContainerTimeContainer}>
            <Text>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            <Text>to</Text>
            <Text>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: "black",
      borderWidth: 2,
      padding: 10,
      height: 70,
      margin: 10,
      backgroundColor: "white",
      borderRadius: 10,
      zIndex: 10,
    },
    taskContainerTimeContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    taskHeading: {
      fontSize: 18,
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