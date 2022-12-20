import { useEffect, useState } from "react";
import {
    View,
    Text,
    Heading,
    Pressable,
    Modal,
    Button,
    Icon
  } from "native-base";
import { StyleSheet, TextInput } from "react-native";
import { Entypo, Feather } from '@expo/vector-icons'; 
import { StartTimeInput, EndTimeInput } from './NewTaskModal';


const TaskModal = ({ updateTaskMutation, openTask, toggleOpenTask, taskTitle, taskDescription, taskStartTime, taskEndTime, taskId, completed }) => {
    const [editMode, toggleEditMode] = useState(false);
    const [editTime, toggleEditTime] = useState(false);
    const [startTime, updateStartTime] = useState(taskStartTime);
    const [endTime, updateEndTime] = useState(taskEndTime);
    const [title, updateTaskTitle] = useState(taskTitle);
    const [description, updateTaskDescription] = useState(taskDescription);
  

    const updateTaskHandler = () => {
      const updatedTask = {
        id: Number(taskId),
        task_name: title,
        task_description: description,
        date: new Date().getTime().toString(),
        time_start: startTime.toString(),
        time_finished: endTime.toString(),
        completed: completed,
      };
      
      updateTaskMutation({variables: {task: updatedTask}});
      toggleOpenTask(false);
      toggleEditMode(false);
    };
  
    // useEffect(() => {
    //   updateStartTime(taskStartTime);
    //   updateEndTime(taskEndTime);
    //   updateTaskDescription(taskDescription);
    //   updateTaskTitle(taskTitle);
    //   console.log("Updated details prop: ", taskDescription)
    //   console.log("Updated details state: ", description)
    //   console.log("Updated details prop: ", typeof taskDescription)
    //   console.log("Updated details state: ", typeof description)
    // }, [taskStartTime, taskEndTime, taskTitle, taskDescription]);
  
    return (
      <Modal isOpen={openTask} onClose={() => toggleOpenTask(false)}>
        <Modal.CloseButton />
          {editMode ? 
          // Edit Task Mode
            (<Modal.Content
              width="95%"
              height="500"
              display="flex"
              flexDirection="column"
              borderColor="grey"
              borderWidth={2}
              alignItems="center"
              safeAreaTop={true}
            >
              <View style={styles.taskContainerTimeContainer}>
                <Pressable style={styles.editToggleButton} onPress={() => toggleEditMode(!editMode)}>
                  <Text>Switch To View Mode</Text>
                  <Icon as={Entypo} name="eye" color="black" size={18}/>
                </Pressable>

                <TextInput value={title} onChangeText={updateTaskTitle} />

                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                  <Text>&nbsp;to&nbsp;</Text>

                  <Text>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>

                  <Button size="sm" variant="subtle" onPress={() => toggleEditTime(true)}>Update Time</Button>
                </View>

                {/* Open Modal to edit startTime and endTime */}
                <Modal isOpen={editTime} onClose={() => toggleEditTime(false)}>
                  <Modal.CloseButton />
                  <Modal.Content style={styles.editTimeModal}>
                    <Heading>Update Time</Heading>

                    <StartTimeInput startTime={Number(startTime)} updateStartTime={updateStartTime} />

                    <EndTimeInput endTime={Number(endTime)} updateEndTime={updateEndTime} />

                    <Button onPress={() => toggleEditTime(false)}>Update Time</Button>
                  </Modal.Content>
                </Modal>

                <View style={styles.modalTaskDescriptionContainer}>
                  <TextInput value={description} onChangeText={updateTaskDescription} />
                </View>

                <Button onPress={updateTaskHandler}>Save</Button>
              </View>
            </Modal.Content>
            ) 
          :
        //   View Task Mode
          (<Modal.Content
          width="95%"
          height="500"
          display="flex"
          flexDirection="column"
          borderColor="grey"
          borderWidth={2}
          alignItems="center"
          safeAreaTop={true}
          >
            <View style={styles.taskContainerTimeContainer}>
              <Pressable style={styles.editToggleButton} onPress={() => toggleEditMode(!editMode)}>
                <Text>Switch To Edit Mode</Text>
                <Icon as={Feather} name="edit" color="black" size={18}/>
              </Pressable>

              <Heading style={styles.taskHeading}>{title}</Heading>

              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                <Text>&nbsp;to&nbsp;</Text>
                <Text>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </View>

              <View style={styles.modalTaskDescriptionContainer}>
                <Text>{description}</Text>
              </View>
            </View>
          </Modal.Content>)
        }
      </Modal>
    )
}

const styles = StyleSheet.create({
  taskContainerTimeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  taskHeading: {
    fontSize: 18,
  },
  modalTaskDescriptionContainer: {
    borderColor: "grey",
    borderWidth: 5,
    minWidth: "90%",
    height: "55%",
  },
  editToggleButton: {
    display: 'flex', 
    alignItems: 'center', 
    borderColor: 'black',
    padding: 5,
    borderWidth: 1,
    borderRadius: 3
  },
  editTimeModal: {
    borderColor: "grey",
    borderWidth: 5,
    minWidth: "85%",
    padding: 10,
    height: "35%",
    gap: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});
  
export default TaskModal;