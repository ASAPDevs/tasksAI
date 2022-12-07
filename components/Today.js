import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Progress,
  Box,
  Button,
  Heading,
  Pressable,
  Input,
  Modal,
  Icon,
  FormControl,
  CheckBox,
} from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import banner from "../assets/banner.jpg";

function Today() {
  // Figure out where we pull date or refetch date
  const [date, setDate] = useState(new Date().toDateString());
  // Need alg to read and determine (completed tasks) / (total tasks)
  const [progress, setProgress] = useState(0);
  const [newTask, openNewTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  // get req to backend to grab tasks for that day (Post req?) or shape what we need in initial gql req
  //   useEffect(() => {
  //     fetch("/endpoint")
  //       .then((res) => res.json())
  //       .then((data) => setTasks(data))
  //       .catch((err) => console.log(err));
  //   }, [date]);

  const addTask = () => {
    // post req to backend
    // setTasks w new tasksArr
    setTasks([
      {
        title: "task1",
        description: "description",
        startTime: 1000,
        endTime: 1200,
        completed: "false",
      },
    ]);
  };

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
        <Box style={styles.box}>
          {tasks.map((task) => (
            <View style={styles.taskContainer} key={task.title}>
              <Text>{task.title}</Text>
              <Text>{task.description}</Text>
              <Text>{task.startTime}</Text>
              <Text>{task.endTime}</Text>
              <Text>{task.completed}</Text>
              {/* <CheckBox value="test" /> */}
            </View>
          ))}
          <Pressable
            onPress={() => openNewTask(true)}
            style={styles.taskContainer}
          >
            <Text>Create a new task..</Text>
          </Pressable>
         {newTask ? <NewTaskModal newTask={newTask} openNewTask={openNewTask} /> : ''}
        </Box>
      </View>
      <Button onPress={() => addTask()} style={styles.btn}>
        +
      </Button>
    </View>
  );
}


const NewTaskModal = ({newTask, openNewTask}) => {
  return (
    <Modal isOpen={newTask} onClose={() => openNewTask(false)} size="lg">
    <Modal.Content
      maxWidth="400"
      height="400"
      display="flex"
      flexDirection="column"
      alignItems="center"
      safeAreaTop={true}
    >
      <Modal.CloseButton />
      <Modal.Body>
        <FormControl>
          <FormControl.Label>Task Title:</FormControl.Label>
          <Input placeholder="Title" minWidth={"100%"} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Task Description:</FormControl.Label>
          <Input minWidth={"100%"} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Start Time:</FormControl.Label>
          <Input minWidth={"100%"} />
        </FormControl>
        <FormControl>
          <FormControl.Label>End Time:</FormControl.Label>
          <Input minWidth={"100%"} />
        </FormControl>
      </Modal.Body>
      <Text>test</Text>
    </Modal.Content>
  </Modal>
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
    borderColor: "green",
    borderWidth: 3,
    // maxWidth: "100%",
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
    borderColor: "cyan",
    borderWidth: 3,
    position: "relative",
    top: 120,
    // bottom: 600,
    // left: -214,
    // height: 100,
    width: "100%",
  },
  btn: {
    position: "absolute",
    bottom: 100,
    right: "50%",
  },
  box: {
    backgroundColor: "cyan",
    // height: 400,
    position: "relative",
    // bottom: 100,
    // bottom: 600,
    display: "flex",
    flexDirection: "column",
  },
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    borderColor: "black",
    borderWidth: 2,
    padding: 5,
  },
});

export default Today;
