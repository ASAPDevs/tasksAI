import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Pressable,
  Input,
  Text,
  Select,
  Modal,
  FormControl,
  Icon,
} from "native-base";
import { StyleSheet, Animated, View } from "react-native";
import { FontAwesome, Octicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { convertDate, displayTime } from "./helpers/dateHelperFunc";
import { useKeyboardVisible } from "./hooks/useKeyboardVisible";


const NewTaskModal = ({ date, newTask, openNewTask, addTaskHandler }) => {
  //this is for the keyboard, keeps track of if the sw keyboard is on or not
  const keyboardVisible = useKeyboardVisible();
  const [startTime, updateStartTime] = useState("");
  const [endTime, updateEndTime] = useState("");
  const [taskTitle, updateTaskTitle] = useState("");
  const [taskDescription, updateTaskDescription] = useState("");
  const [taskCategory, updateTaskCategory] = useState(1);
  const [invalidSubmission, toggleInvalidSubmission] = useState(false);

  //useCallback is more efficient here, since we can cache this function in between re-renders. 
  //Dependency is an empty array because we don't need these values or functions to recalculate.
  const clearInputs = useCallback(() => {
    updateTaskTitle("");
    updateTaskDescription("");
    updateStartTime("");
    updateEndTime("")
    updateTaskCategory(1);
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
      addTaskHandler(taskTitle, taskDescription, start, end, taskCategory);
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
      top={keyboardVisible ? -115 : -50}
      isOpen={newTask}
      onClose={() => openNewTask(false)}
      size="xl"
      style={{shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Modal.Header
        borderTopLeftRadius="5%"
        borderTopRadius="5%"
        width="375"
        bgColor="#DBE6EC"
        borderBottomRadius={0}
        borderColor="darkgrey"
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
        height="440"
        display="flex"
        flexDirection="column"
        alignItems="center"
        borderColor="darkgrey"
        borderWidth={1}
        borderTopWidth={0}
        paddingTop={5}
        bgColor="#DBE6EC"
        borderTopRadius={0}
        borderBottomRadius="5%"
        style={{shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,}}
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
              bgColor="rgb(243,228,197)"
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
            <FormControl.Label fontFamily="FamiljenGrotesk" style={{ fontFamily: "FamiljenGrotesk" }}>
              Description:
            </FormControl.Label>
            <View style={{ height: "100%" }}>
              <Input
                multiline={true}
                height={"75%"}
                maxHeight={"75%"}
                bgColor="rgb(243,228,197)"
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
          {/* Category Section */}
            <FormControl alignItems="center">
              <FormControl.Label style={{ fontFamily: "FamiljenGrotesk" }}>Category: </FormControl.Label>
              <Select bgColor="rgb(243,228,197)" borderColor="black" borderWidth={1} width="80%" defaultValue={1} onValueChange={(itemValue) => updateTaskCategory(itemValue)} >
                  <Select.Item label="Chore/Errand" value={1} />
                  <Select.Item label="Academic" value={2} />
                  <Select.Item label="Work" value={3} />
                  <Select.Item label="Social" value={4} />
                  <Select.Item label="Spiritual" value={5} />
                  <Select.Item label="Other" value={6} />
              </Select>
            </FormControl>
          <CreateButton onPress={onPress} />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};



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
    if (endTime !== '' && endTime < convertedTime) {
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
          bgColor="rgb(243,228,197)"
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
    if (startTime !== '' && convertedTime < startTime) {
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
          bgColor="rgb(243,228,197)"
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
