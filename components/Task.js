import { useState } from "react";
import {
    View,
    Text,
    Heading,
    Pressable,
    Modal
  } from "native-base";
import { StyleSheet } from "react-native";


const Task = ({ title, description, startTime, endTime, completed }) => {
    const [openTask, toggleOpenTask] = useState(false);
  
    // //Don't delete this
    // let displayStartTime = new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    // let displayEndTime = new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  
    return (
      <Pressable onPress={() => toggleOpenTask(true)}>
        <View style={styles.taskContainer} key={title}>
          <Heading style={styles.taskHeading}>{title}</Heading>
          <View style={styles.taskContainerTimeContainer}>
            <Text>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            <Text>to</Text>
            <Text>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </View>
          <Modal isOpen={openTask} onClose={() => toggleOpenTask(false)}>
            <Modal.CloseButton />
            <Modal.Content
              width="95%"
              height="400"
              display="flex"
              flexDirection="column"
              borderColor="grey"
              borderWidth={2}
              alignItems="center"
              safeAreaTop={true}
            >
              <View style={styles.taskContainerTimeContainer}>
                <Heading style={styles.taskHeading}>{title}</Heading>
                <Text>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                <Text>to</Text>
                <Text>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                <View style={styles.modalTaskDescriptionContainer}>
                  <Text>{description}</Text>
                </View>
              </View>
            </Modal.Content>
          </Modal>
          {/* <CheckBox value="test" /> */}
        </View>
      </Pressable>
    );
  };

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
      borderRadius: 10,
    },
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
      minWidth: "100%",
      height: "75%",
    },
  });

export default Task;