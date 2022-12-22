import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  Button,
  Pressable,
  Input,
  Modal,
  FormControl,
  Icon,
} from "native-base";
import { StyleSheet, Animated, View } from "react-native";
import { FontAwesome, Octicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { min } from "react-native-reanimated";

const NewTaskModal = ({ date, newTask, openNewTask, setTasks, addTaskHandler }) => {
  const [startTime, updateStartTime] = useState("");
  const [endTime, updateEndTime] = useState("");
  const [taskTitle, updateTaskTitle] = useState("");
  const [taskDescription, updateTaskDescription] = useState("");
  const [invalidSubmission, toggleInvalidSubmission] = useState(false);

  //useCallback is more efficient here, since we can cache this function in between re-renders. 
  //Dependency is an empty array because we don't need these values or functions to recalculate.
  const clearInputs = useCallback(() => {
    updateTaskTitle("");
    updateTaskDescription("");
    updateStartTime("");
    updateEndTime("")
  }, [])

  //handles main functionality of onPress
  //useCallback is efficient here as well.
  const onPress = () => {
    if (taskTitle == "") {
      toggleInvalidSubmission(true);
    } else {
      const startOfDay = new Date(date).getTime();
      const endOfDay = startOfDay + 86400000 - 60000;
      const start = (typeof startTime === 'number') ? startTime : startOfDay;
      let end = (typeof endTime === 'number') ? endTime : endOfDay;
      // if (start > end) {
      //   end = start;
      // }
      addTaskHandler(taskTitle, taskDescription, startTime, endTime);
      clearInputs();
    }
  }

  //Memoize this functional component so we don't need to re-render again. 
  //More Effieicny
  const CreateButton = ({ onPress }) => {
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(1));

    const onPressIn = () => {
      Animated.spring(animatedValue, {
        toValue: 0.98,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 7,
        tension: 30,
        useNativeDriver: true,
      }).start();
    };

    const buttonStyle = {
      transform: [{ scale: animatedValue }],
    };

    return (
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <Animated.View
          style={{
            ...buttonStyle,
            marginTop: 15,
            alignSelf: "center",
            width: "30%",
            height: 42.5,
            borderRadius: 5,
            backgroundColor: "#FAA946",
            flexDirection: "column",
            display: "flex",
            borderColor: "black",
            borderWidth: 1,
            justifyContent: "center",
          }}
        >
          <Icon
            marginTop={0.5}
            alignSelf="center"
            as={Octicons}
            name="diff-added"
            size={5}
            color="white"
          />
        </Animated.View>
      </Pressable>
    );
  }

  useEffect(() => {
    if (invalidSubmission)
      setTimeout(() => toggleInvalidSubmission(false), 5000);
  }, [invalidSubmission]);

  return (
    <Modal
      top={5}
      isOpen={newTask}
      onClose={() => openNewTask(false)}
      size="xl"
    >
      <Modal.Header
        borderTopLeftRadius="5%"
        borderTopRadius="5%"
        width="375"
        bgColor="#F0F0F0"
        borderBottomRadius={0}
        borderColor="#ADB7B8"
        borderWidth={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontFamily="FamiljenBold"
      >
        New Task
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Content
        width="375"
        height="400"
        display="flex"
        flexDirection="column"
        alignItems="center"
        borderColor="#ADB7B8"
        borderWidth={1}
        borderTopWidth={0}
        paddingTop={5}
        bgColor="#F0F0F0"
        borderTopRadius={0}
        borderBottomRadius="5%"
      >
        <Modal.Body>
          <FormControl style={styles.taskNameContainer}>
            <FormControl.Label style={{ fontFamily: "FamiljenGrotesk" }}>
              Title:
            </FormControl.Label>
            <Input
              invalidOutlineColor="red.500"
              isInvalid={invalidSubmission ? true : false}
              borderColor="black"
              value={taskTitle}
              focusOutlineColor="black"
              _focus={{
                bgColor: `${invalidSubmission ? "white" : "rgb(243,228,197)"}`,
              }}
              onChangeText={(text) => updateTaskTitle(text)}
              placeholder={
                invalidSubmission
                  ? "A title is needed for a new task!"
                  : "Title"
              }
              style={{ fontFamily: "FamiljenGrotesk" }}
              minWidth={"100%"}
            />
          </FormControl>
          <FormControl style={styles.taskDescriptionContainer}>
            <FormControl.Label style={{ fontFamily: "FamiljenGrotesk" }}>
              Description:
            </FormControl.Label>
            <View style={{ height: "100%" }}>
              <Input
                multiline={true}
                height={"75%"}
                maxHeight={"75%"}
                borderColor="black"
                _focus={{
                  bgColor: "rgb(243,228,197)",
                }}
                focusOutlineColor="black"
                value={taskDescription}
                onChangeText={(text) => updateTaskDescription(text)}
                placeholder="Description"
                minWidth={"100%"}
                style={{ fontFamily: "FamiljenGrotesk" }}
              />
            </View>
          </FormControl>
          <View style={styles.timeInputsContainer}>
            <StartTimeInput
              startTime={startTime}
              endTime={endTime}
              updateStartTime={updateStartTime}
              updateEndTime={updateEndTime}
              date={date}
            />
            <EndTimeInput
              startTime={startTime}
              endTime={endTime}
              updateStartTime={updateStartTime}
              updateEndTime={updateEndTime}
              date={date}
            />
          </View>
          <CreateButton onPress={onPress} />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

// this function takes a user selected date and time,
// then it returns the correct time in miliseconds
const convertDate = (selectedDate, selectedTime) => {
  const tempDate = new Date(selectedDate);
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();
  const day = tempDate.getDate();
  const hourAndMinutes = selectedTime.slice(0, selectedTime.indexOf(' ')).split(':');
  const minutes = Number(hourAndMinutes[1]);
  let hour = Number(hourAndMinutes[0]);

  if (selectedTime.includes('PM')) {
    if (hour === 12) {
      hour = 12;
    } else {
      hour += 12;
    }
    const convertedTime = new Date(year, month, day, hour, minutes).getTime();
    return convertedTime;
  } else {
    if (hour === 12) {
      hour = 0;
    }
    const convertedTime = new Date(year, month, day, hour, minutes).getTime();
    return convertedTime;
  }
}

const displayTime = (milisec) => {
  const time = new Date(Number(milisec));
  let hours = time.getHours();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours === 12) {
    return `${12}:${minutes} PM`;
  } else if (hours === 0) {
    return `${12}:${minutes} AM`;
  } else if (hours > 12) {
    return `${hours % 12}:${minutes} PM`;
  } else {
    return `${hours}:${minutes} AM`;
  }
}

export const StartTimeInput = ({ startTime, endTime, updateStartTime, updateEndTime, date }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSetStartTime = (time) => {
    const tempDate = new Date(time);
    const hourAndMinutes = tempDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: "2-digit"
    });
    const timeZoneOffset = tempDate.getTimezoneOffset();
    const convertedTime = convertDate(date, hourAndMinutes, timeZoneOffset);

    updateStartTime(convertedTime);
    // convert end time to start time if it's falsy or before start time
    if (endTime?.length !== 0 && endTime < convertedTime) {
      updateEndTime(convertedTime);
    }
    setDatePickerVisibility(false);
  };

  return (
    <FormControl style={styles.timeInputContainer}>
      <FormControl.Label style={styles.timeInputContainerLabel}>
        Start Time:
      </FormControl.Label>
      <View style={styles.timeInputWrapper}>
        <Input
          isReadOnly
          borderColor="black"
          style={styles.timeInput}
          value={Number(startTime) ? displayTime(startTime) : "None"}
          InputRightElement={
            <Button
              height="100%"
              borderRadius={0}
              borderColor="black"
              borderLeftWidth={1}
              bgColor="#FAA946"
              onPress={() => setDatePickerVisibility(true)}
              size="sm"
            >
              <Icon as={FontAwesome} name="clock-o" color="white" size={15} />
            </Button>
          }
        />
      </View>
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

export const EndTimeInput = ({ startTime, endTime, updateStartTime, updateEndTime, date }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSetEndTime = (time) => {
    const tempDate = new Date(time);
    const hourAndMinutes = tempDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: "2-digit"
    });
    const timeZoneOffset = tempDate.getTimezoneOffset();
    const convertedTime = convertDate(date, hourAndMinutes, timeZoneOffset);

    updateEndTime(convertedTime);
    // convert start time to end time if it's falsy or before start time
    if (startTime?.length !== 0 && convertedTime < startTime) {
      updateStartTime(convertedTime);
    }
    setDatePickerVisibility(false);
  };

  return (
    <FormControl style={styles.timeInputContainer}>
      <FormControl.Label style={styles.timeInputContainerLabel}>
        End Time:
      </FormControl.Label>
      <View style={styles.timeInputWrapper}>
        <Input
          isReadOnly
          borderColor="black"
          style={styles.timeInput}
          value={Number(startTime) ? displayTime(endTime) : "None"}
          InputRightElement={
            <Button
              height="100%"
              borderRadius={0}
              borderLeftColor="black"
              borderLeftWidth={1}
              borderRightColor="#FAA946"
              borderRightWidth={1}
              bgColor="#FAA946"
              onPress={() => setDatePickerVisibility(true)}
              size="sm"
            >
              <Icon as={FontAwesome} name="clock-o" color="white" size={15} />
            </Button>
          }
        />
      </View>
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
  createTaskContainer: {
    borderColor: "black",
    borderWidth: 3,
  },
  taskNameContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  taskDescriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "35%",
    maxHeight: "35%",
  },
  timeInputsContainer: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "100%",
    justifyContent: "space-between",
    padding: 5,
  },
  timeInputContainer: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  timeInputContainerLabel: {
    fontFamily: "FamiljenBold",
  },
  timeInputWrapper: {
    width: "100%",
    overflow: "hidden",
    height: 40,
  },
  timeInput: {
    fontFamily: "FamiljenGrotesk",
    height: "100%",
  },
});

export default NewTaskModal;
