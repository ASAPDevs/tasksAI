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
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

  //   const addTask = () => {
  //     // post req to backend
  //     // setTasks w new tasksArr
  //     setTasks([
  //       {
  //         title: "task1",
  //         description: "description",
  //         startTime: 1000,
  //         endTime: 1200,
  //         completed: "false",
  //       },
  //     ]);
  //     openNewTask(false);
  //   };

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
            <Task description={task.description} title={task.title} startTime={task.startTime} completed={task.completed} endTime={task.endTime}/>
          ))}
          <Pressable
            onPress={() => openNewTask(true)}
            style={styles.taskContainer}
          >
            <Text>Create a new task..</Text>
          </Pressable>
          {newTask ? (
            <NewTaskModal
              setTasks={setTasks}
              newTask={newTask}
              openNewTask={openNewTask}
            />
          ) : (
            ""
          )}
        </Box>
      </View>
      {/* <Button onPress={() => addTask()} style={styles.btn}>
        +
      </Button> */}
    </View>
  );
}

const Task = ({ title, description, startTime, endTime, completed }) => {


  return (
    <View style={styles.taskContainer} key={title}>
      <Text>{title}</Text>
      <Text>{description}</Text>
      <Text>{startTime}</Text>
      <Text>{endTime}</Text>
      <Text>{completed}</Text>
      {/* <CheckBox value="test" /> */}
    </View>
  );
};

const NewTaskModal = ({ newTask, openNewTask, setTasks }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startTime, updateStartTime] = useState("");
  const [endTime, updateEndTime] = useState("");
  const [taskTitle, updateTaskTitle] = useState("");
  const [taskDescription, updateTaskDescription] = useState("");

  const showDatePicker = () => {
    console.log("pressing date picker");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleSetStartTime = (date) => {
    console.warn("A date has been picked: ", date);
    updateStartTime(date.toLocaleTimeString());
    hideDatePicker();
  };

  const handleSetEndTime = (date) => {
    console.warn("A date has been picked: ", date);
    updateEndTime(date.toLocaleTimeString());
    hideDatePicker();
  };

  const addTask = () => {
    let newTask = {
      title: taskTitle,
      description: taskDescription,
      startTime: startTime,
      endTime: endTime,
    };
    setTasks((task) => [...task, newTask]);
    openNewTask(false);
  };

  useEffect(() => {}, [isDatePickerVisible]);

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
            <Input
              value={taskTitle}
              onChange={(e) => updateTaskTitle(e.target.value)}
              placeholder="Title"
              minWidth={"100%"}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Task Description:</FormControl.Label>
            <Input
              value={taskDescription}
              onChange={(e) => updateTaskDescription(e.target.value)}
              placeholder="Description"
              minWidth={"100%"}
            />
          </FormControl>
          <StartTimeInput
            startTime={startTime}
            updateStartTime={updateStartTime}
          />
          <EndTimeInput endTime={endTime} updateEndTime={updateEndTime} />
          <Button onPress={addTask} marginTop={5}>
            <Text>Add Task</Text>
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

const StartTimeInput = ({ startTime, updateStartTime }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSetStartTime = (date) => {
    updateStartTime(date.toLocaleString());
    setDatePickerVisibility(false);
  };

  return (
    <FormControl>
      <FormControl.Label>Start Time:</FormControl.Label>
      <Pressable>
        <Input
          isReadOnly
          value={startTime}
          // onChange={(e) => setStartTime(e.target.value.toLocaleString())}
          minWidth={"100%"}
          InputRightElement={
            <Button onPress={() => setDatePickerVisibility(true)} size="sm">
              Pick Time
            </Button>
          }
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleSetStartTime}
        onCancel={() => setDatePickerVisibility(false)}
        is24Hour={false}
      />
    </FormControl>
  );
};

const EndTimeInput = ({ endTime, updateEndTime }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSetEndTime = (date) => {
    updateEndTime(date.toLocaleString());
    setDatePickerVisibility(false);
  };

  return (
    <FormControl>
      <FormControl.Label>End Time:</FormControl.Label>
      <Pressable>
        <Input
          isReadOnly
          value={endTime}
          // onChange={(e) => setStartTime(e.target.value.toLocaleString())}
          minWidth={"100%"}
          InputRightElement={
            <Button onPress={() => setDatePickerVisibility(true)} size="sm">
              Pick Time
            </Button>
          }
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleSetEndTime}
        onCancel={() => setDatePickerVisibility(false)}
        is24Hour={false}
      />
    </FormControl>
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
    height: 50,
  },
});

export default Today;
