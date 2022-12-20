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


const Task = ({ taskId, title, description, startTime, endTime, completed, refetch }) => {
    const [openTask, toggleOpenTask] = useState(false);
    const [pushTaskModal, openPushTaskModal] = useState(false);
    
    const [updateTask] = useMutation(UPDATE_TASK, {
      onCompleted: () => {
        refetch()
      },
      onError: (err) => {
        console.log("Error Updating Task: ", err)
      }
    });

    
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
            <PushComponent pushTaskHandler={pushTaskHandler} pushTaskModal={pushTaskModal} openPushTaskModal={openPushTaskModal} />
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

  export const UnderTaskButton = ({item, rowMap, handleDeleteTask}) => {
    const [deleteConfirmation, toggleDeleteConfirmation] = useState(false);
  

      return (
        <View style={styles.deleteTaskContainer}>
          <View style={{backgroundColor: 'green', height: '100%', minWidth: '55%', maxWidth:'55%'}}>
            <Icon
                as={AntDesign}
                name="checkcircle"
                color="white"
                size={8}
              />
          </View>
          {!deleteConfirmation ? (
          <Pressable style={{display: 'flex', flex: '1', minWidth: '50%', maxWidth:'50%', height:'100%', backgroundColor: 'red', width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} onPress={() => {
            toggleDeleteConfirmation(true)
          }}>
            <Text style={{color: 'white'}}>Delete </Text>
            <Icon
              as={MaterialCommunityIcons}
              name="delete"
              color="white"
              size={"8"}
              marginRight={12}
            />
          </Pressable>) :
          <Pressable style={{display: 'flex', minWidth: '50%', maxWidth:'50%', height:'100%', backgroundColor: 'red', width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}onPress={() => {
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
              marginRight={10}
            />
          </Pressable>
            }
        </View>
      );
  }

  export const PushComponent = ({ pushTaskHandler, pushTaskModal, openPushTaskModal }) => {
    const [selectedValue, updateSelectedValue] = useState(0);
    
    // useEffect(() => {
    //   console.log("checking selected: ", selectedValue);
    // }, [selectedValue])

    return (
      <Modal isOpen={pushTaskModal} onClose={() => openPushTaskModal(false)} >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header alignSelf="center" >Push Task</Modal.Header>
          <Modal.Body display="flex" flexDirection="row" justifyContent="space-between">
            <View width="100%" display="flex" alignItems="center" >
              <Text>New Time</Text>
              <Select width="50%" onValueChange={(itemValue) => updateSelectedValue(itemValue)} >
                <Select.Item label="1 hr" value={1} />
                <Select.Item label="2 hr" value={2} />
                <Select.Item label="3 hr" value={3} />
              </Select>
              <Button onPress={() => pushTaskHandler(selectedValue)} >Push {selectedValue} hours</Button>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
  }

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