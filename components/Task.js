import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Heading,
    Pressable,
    Icon,
    Button,
    Select,
    Modal  } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { UPDATE_TASK, PUSH_TASK } from "./helpers/mutations";
import { useMutation } from "@apollo/client";
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons'; 
import TaskModal from "./TaskModal";
const LazyLoadModal = React.lazy(() => import('./TaskModal'))
const LazyLoadPushModal = React.lazy(() => import('./PushComponent'))
// import PushComponent from "./PushComponent";


const Task = ({ taskId, title, description, startTime, endTime, completed, refetch }) => {
    const [openTask, toggleOpenTask] = useState(false);
    const [pushTaskModal, openPushTaskModal] = useState(false);
    
    console.log("toggling pushTaskModal: ", pushTaskModal)
    // const [updateTask] = useMutation(UPDATE_TASK, {
    //   onCompleted: () => {
    //     refetch()
    //   },
    //   onError: (err) => {
    //     console.log("Error Updating Task: ", err)
    //   }
    // });

    
    const [pushTask] = useMutation(PUSH_TASK, {
      onCompleted: () => {
        refetch()
      },
      onError: (err) => {
        console.log("Error Pushing Task: ", err)
      }
    });

    const pushTaskHandler = (selectedValue) => {
      let timeToAdd = selectedValue * 3600000
      let newStartTime = Number(startTime) + timeToAdd
      let newEndTime = Number(endTime) + timeToAdd
      pushTask({variables: {id: Number(taskId), newStartTime: newStartTime.toString(), newEndTime: newEndTime.toString()}})
    }

  
    return (
      <Pressable 
        onPress={() => toggleOpenTask(true)}
      >
        <View style={styles.taskContainer} key={title}>
          <View style={styles.taskContainerInnerWrapper}>
            <Heading style={styles.taskHeading}>{title}</Heading>

            {/* Push Task Button */}
            <Pressable onPress={() => openPushTaskModal(true)} style={{borderColor: "black", borderWidth: 2, position: 'absolute', right: 115}}>
              <Icon as={AntDesign} name="rightcircle" size={6} color="amber.500" style={{position: 'relative'}} />
            </Pressable>

            {pushTaskModal && <LazyLoadPushModal pushTaskHandler={pushTaskHandler} pushTaskModal={pushTaskModal} openPushTaskModal={openPushTaskModal} />}

            <View style={styles.taskContainerTimeContainer}>
              <Text style={{...styles.timeContainerText, ...styles.timeText}}>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              <Text style={styles.timeContainerText}>to</Text>
              <Text style={{...styles.timeContainerText, ...styles.timeText}}>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            </View>
            
            {/* Right Icon At The End Of The Component */}
            <View style={styles.swipeRightIcon}>
              <Icon as={Entypo} name="chevron-small-right" size={5} />
            </View>
          </View>
          {openTask ?? 
         <LazyLoadModal />}
        </View>
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    taskContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#ceddf5",
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
      alignSelf: 'center',
      justifyContent: "center",
      height: 90,
      width: '95%',
      zIndex: 9,
      // backgroundColor: 'red',
    },
    swipeRightIcon: {
      position: "absolute",
      right: -18.5
    }
  });

export default React.memo(Task);