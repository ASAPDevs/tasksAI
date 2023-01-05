import { useState, useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  View,
  Text,
  Heading,
  Pressable,
  Modal,
  Switch,
  Select,
  Button,
  FormControl,
  Icon,
  ScrollView,
} from "native-base";
import { StyleSheet, TextInput, PanResponder } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { StartTimeInput, EndTimeInput } from "./NewTaskModal";
import {
  getTimeOfDay,
  convertDate,
  displayTime,
} from "./helpers/dateHelperFunc";

const taskCategories = {
  1: "Errand",
  2: "Academic",
  3: "Work",
  4: "Social",
  5: "Spiritual",
  6: "Other",
};

// const taskCategoryColors = {
//   'Errand': '#FF9900',
//   'Academic': '#0B486B',
//   'Work': '#FE4365',
//   'Social': '#630947',
//   'Spiritual': '#A8DBA8',
//   'Other': 'black'
// }

// const taskCategories = {
//   1: 'Errand',
//   2: 'Academic',
//   3: 'Work',
//   4: 'Social',
//   5: 'Spiritual',
//   6: 'Other'
// }

const taskCategoryColors = {
  1: "#FF9900",
  2: "#0B486B",
  3: "#FE4365",
  4: "#630947",
  5: "#A8DBA8",
  6: "black",
};

const TaskModal = ({
  prevDay,
  taskDate,
  taskId,
  updateTaskMutationNoRefetch,
  updateTaskMutationRefetch,
  openTask,
  toggleOpenTask,
  taskTitle,
  taskDescription,
  taskStartTime,
  taskEndTime,
  completed,
  taskCategory,
}) => {
  const [startTime, updateStartTime] = useState(taskStartTime);
  const [endTime, updateEndTime] = useState(taskEndTime);
  const [title, updateTaskTitle] = useState(taskTitle);
  const [description, updateTaskDescription] = useState(taskDescription);
  const [category, updateTaskCategory] = useState(taskCategory);
  const [date, updateTaskDate] = useState(taskDate);
  const [invalidTimeInput, setInvalidTimeInput] = useState(false);

  const updateTaskHandler = () => {
    const updatedTask = {
      id: Number(taskId),
      task_name: title,
      task_description: description,
      date: date.getTime().toString(),
      time_start: startTime.toString(),
      time_finished: endTime.toString(),
      time_of_day: getTimeOfDay(startTime.toString()),
      category: category,
      completed: completed,
    };
    date !== taskDate
      ? updateTaskMutationRefetch({ variables: { task: updatedTask } })
      : updateTaskMutationNoRefetch({ variables: { task: updatedTask } });
    toggleOpenTask(false);
  };

  return (
    <Modal
      isOpen={openTask}
      onClose={() => {
        //checks if any changers were made
        if (
          title !== taskTitle ||
          description !== taskDescription ||
          category !== taskCategory ||
          startTime !== taskStartTime ||
          endTime !== taskEndTime ||
          date !== taskDate
        ) {
          //checks if the updated times are valid
          if (startTime < endTime) {
            updateTaskHandler();
          }
        } else {
          toggleOpenTask(false);
        }
      }}
    >
      <Modal.Content
        minWidth="90%"
        maxWidth="90%"
        height="575"
        borderRadius={5}
        marginBottom={0}
        bgColor="#DBE6EC"
        display="flex"
        bottom={20}
        flexDirection="column"
        // borderColor="grey"
        // borderWidth={2}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderTopWidth: 0,
        }}
        alignItems="center"
        justifyContent="center"
        safeAreaBottom={true}
      >
        <Modal.CloseButton />
        <InnerTaskModal
          title={title}
          category={category}
          startTime={startTime}
          endTime={endTime}
          description={description}
          date={date}
          updateTaskTitle={updateTaskTitle}
          updateTaskDescription={updateTaskDescription}
          updateTaskCategory={updateTaskCategory}
          updateStartTime={updateStartTime}
          updateEndTime={updateEndTime}
          updateTaskDate={updateTaskDate}
          invalidTimeInput={invalidTimeInput}
          setInvalidTimeInput={setInvalidTimeInput}
        />
      </Modal.Content>
    </Modal>
  );
};

const InnerTaskModal = ({
  title,
  startTime,
  endTime,
  description,
  category,
  date,
  updateTaskTitle,
  updateTaskCategory,
  updateTaskDescription,
  updateStartTime,
  updateEndTime,
  updateTaskDate,
  invalidTimeInput,
  setInvalidTimeInput,
}) => {
  const [editTitle, toggleEditTitle] = useState(false);
  const [editDescription, toggleEditDescription] = useState(false);
  const [editCategory, toggleEditCategory] = useState(false);
  const [editStartTime, toggleEditStartTime] = useState(false);
  const [editEndTime, toggleEditEndTime] = useState(false);
  const [editDate, toggleEditDate] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        toggleEditTitle(false);
        toggleEditDescription(false);
        toggleEditCategory(false);
        toggleEditStartTime(false);
        toggleEditEndTime(false);
        toggleEditDate(false);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        toggleEditTitle(false);
        toggleEditDescription(false);
        toggleEditCategory(false);
        toggleEditStartTime(false);
        toggleEditEndTime(false);
        toggleEditDate(false);
      },
    })
  ).current;

  const handleSetTime = (time, type) => {
    const tempDate = new Date(time);
    const hourAndMinutes = tempDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timeZoneOffset = tempDate.getTimezoneOffset();
    const convertedTime = convertDate(date, hourAndMinutes, timeZoneOffset);
    //checks if times are valid
    if (type === "start") {
      convertedTime > endTime
        ? setInvalidTimeInput(true)
        : setInvalidTimeInput(false);
    } else if (type === "end") {
      convertedTime < startTime
        ? setInvalidTimeInput(true)
        : setInvalidTimeInput(false);
    }
    //update state regardless
    type === "start"
      ? updateStartTime(convertedTime)
      : updateEndTime(convertedTime);
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={styles.taskContainerTimeContainer}
    >
      <View
        borderTopWidth={0}
        style={{
          borderColor: "grey",
          minWidth: "90%",
          maxWidth: "90%",
          alignItems: "center",
          minHeight: 100,
          maxHeight: 100,
          paddingBottom: 5,
          justifyContent: "center",
        }}
      >
        <Text style={{ ...styles.taskPropertyLabel, marginBottom: 0 }}>
          Task Name:
        </Text>
        <Pressable
          style={styles.titleContainer}
          bgColor={editTitle ? "rgb(242, 238, 230)" : "transparent"}
          onPress={() => toggleEditTitle(!editTitle)}
        >
          {!editTitle ? (
            <View>
              <Text style={styles.taskTitle}>{title}</Text>
            </View>
          ) : (
            <TextInput
              autoFocus={editTitle}
              value={title}
              style={{ ...styles.taskTitle, alignSelf: "center" }}
              onChangeText={updateTaskTitle}
            />
          )}
        </Pressable>
      </View>
      <View borderBottomWidth={0} style={styles.timesViewContainer}>
        <Text style={{ ...styles.taskPropertyLabel, marginBottom: 3 }}>
          Task Times:
        </Text>
        {/* Date Container */}
        <Pressable onPress={() => toggleEditDate(true)}>
          <Text style={styles.taskDate}>
            {date.toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <DateTimePickerModal
            isVisible={editDate}
            date={date}
            mode="date"
            onConfirm={(currentDate) => {
              updateTaskDate(currentDate);
              toggleEditDate(false);
            }}
            onCancel={() => toggleEditDate(false)}
          />
        </Pressable>
        {/* Time Container */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => toggleEditStartTime(true)}>
            <View
              bgColor="green.300"
              // borderColor={invalidTimeInput ? "red" : "black"}
              // borderWidth={1}
              style={
                invalidTimeInput
                  ? styles.invalidTimeContainer
                  : styles.timeContainer
              }
            >
              <Text
                style={{
                  fontSize: 8.5,
                  position: "absolute",
                  bottom: 15,
                  fontFamily: "FamiljenGrotesk",
                }}
              >
                Start
              </Text>
              <Text
                style={{
                  position: "relative",
                  top: 5,
                  fontFamily: "FamiljenBold",
                  fontSize: 15,
                }}
              >
                {new Date(Number(startTime)).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <DateTimePickerModal
                isVisible={editStartTime}
                mode="time"
                onConfirm={(currentDate) => {
                  handleSetTime(currentDate, "start");
                  toggleEditStartTime(false);
                }}
                onCancel={() => toggleEditStartTime(false)}
                is24Hour={false}
              />
            </View>
          </Pressable>

          <Icon
            as={MaterialCommunityIcons}
            fontWeight={"bold"}
            size="lg"
            name="arrow-right"
            margin={5}
          />

          <Pressable onPress={() => toggleEditEndTime(true)}>
            <View
              // borderColor="red.500"
              bgColor="red.300"
              style={
                invalidTimeInput
                  ? styles.invalidTimeContainer
                  : styles.timeContainer
              }
            >
              <Text
                style={{
                  fontSize: 8.5,
                  position: "absolute",
                  bottom: 15,
                  fontFamily: "FamiljenGrotesk",
                }}
              >
                End
              </Text>
              <Text
                style={{
                  position: "relative",
                  top: 5,
                  fontFamily: "FamiljenBold",
                  fontSize: 15,
                }}
              >
                {new Date(Number(endTime)).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <DateTimePickerModal
                isVisible={editEndTime}
                mode="time"
                onConfirm={(currentDate) => {
                  handleSetTime(currentDate, "end");
                  toggleEditEndTime(false);
                }}
                onCancel={() => toggleEditEndTime(false)}
                is24Hour={false}
              />
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.modalTaskDescriptionContainer}>
        <Text style={{ ...styles.taskPropertyLabel, marginBottom: 5 }}>
          Task Description:
        </Text>
        <Pressable onPress={() => toggleEditDescription(true)}>
          <ScrollView
            style={{
              padding: 10,
              borderColor: "grey",
              borderWidth: 1,
              minWidth: "95%",
              maxWidth: "95%",
              maxHeight: "80.5%",
              backgroundColor: "rgb(242, 238, 230)",
            }}
          >
            {!editDescription && (
               <Text
               style={{
                 fontFamily: "FamiljenGrotesk",
                 textAlign: "left",
                 fontSize: 15,
               }}
             >
               {description}
             </Text>
            )}
            {editDescription && (
              <TextInput
                autoFocus={editDescription}
                autoComplete={false}
                value={description}
                onChangeText={updateTaskDescription}
                style={{
                  fontFamily: "FamiljenGrotesk",
                  textAlign: "left",
                  fontSize: 15,
                }}
              />
            )}
          </ScrollView>
        </Pressable>
      </View>
      <View
        style={{
          borderColor: "grey",
          borderBottomWidth: 0,
          minWidth: "90%",
          maxWidth: "90%",
          marginTop: 0,
          alignItems: "center",
          height: 60.5,
          marginBottom: 10,
        }}
      >
        <Text style={{ ...styles.taskPropertyLabel, marginBottom: 20 }}>
          Task Category:
        </Text>
        <Pressable onPress={() => toggleEditCategory(true)}>
          <View
            style={{
              ...styles.categoryContainer,
              borderColor: `${taskCategoryColors[category]}`,
              borderWidth: 1,
            }}
          >
            <Text
              color={taskCategoryColors[category]}
              fontFamily="FamiljenGrotesk"
            >
              {taskCategories[category]}
            </Text>
          </View>
        </Pressable>
      </View>
      <Modal isOpen={editCategory} onClose={() => toggleEditCategory(false)}>
        <Modal.Content
          alignItems="center"
          height={100}
          minWidth="90%"
          bgColor="#DBE6EC"
        >
          <FormControl alignItems="center">
            <FormControl.Label style={{ fontFamily: "FamiljenGrotesk" }}>
              Change Category:{" "}
            </FormControl.Label>
            <Select
              bgColor="rgb(243,228,197)"
              borderColor="black"
              borderWidth={1}
              width="80%"
              defaultValue={category}
              onValueChange={(itemValue) => updateTaskCategory(itemValue)}
            >
              <Select.Item label="Chore/Errand" value={1} />
              <Select.Item label="Academic" value={2} />
              <Select.Item label="Work" value={3} />
              <Select.Item label="Social" value={4} />
              <Select.Item label="Spiritual" value={5} />
              <Select.Item label="Other" value={6} />
            </Select>
          </FormControl>
        </Modal.Content>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainerTimeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 50,
  },
  taskHeading: {
    fontSize: 18,
  },
  modalTaskDescriptionContainer: {
    borderColor: "grey",
    borderBottomWidth: 0,
    minWidth: "90%",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "90%",
    minHeight: "45%",
    maxHeight: "45%",
    marginTop: 0,
    marginBottom: -20,
  },
  editToggleButton: {
    display: "flex",
    alignItems: "center",
    borderColor: "black",
    padding: 5,
    borderWidth: 1,
    borderRadius: 3,
  },
  editTimeModal: {
    borderColor: "grey",
    borderWidth: 5,
    minWidth: "85%",
    padding: 10,
    height: "35%",
    gap: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  titleContainer: {
    padding: 8.5,
    borderColor: "grey",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "80%",
    minHeight: 35,
    maxHeight: 65,
  },
  categoryContainer: {
    maxWidth: "55%",
    maxHeight: 25,
    minHeight: 25,
    marginBottom: 5,
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
    padding: 3.5,
    display: "flex",
    marginTop: -15,
  },
  taskPropertyLabel: {
    fontFamily: "FamiljenGrotesk",
    color: "grey",
    fontSize: 10,
  },
  taskTitle: {
    fontSize: 15,
    fontFamily: "FamiljenBold",
    textAlign: "center",
  },
  timesViewContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: 100,
    maxHeight: 100,
    alignItems: "center",
    margin: 12.5,
    borderColor: "grey",
    minWidth: "90%",
    justifyContent: "center",
  },
  timeContainer: {
    borderColor: "black",
    borderWidth: 1,
    height: "55.5%",
    width: 90,
    padding: 3.5,
    alignItems: "center",
  },
  invalidTimeContainer: {
    borderColor: "red",
    borderWidth: 1,
    height: "55.5%",
    width: 90,
    padding: 3.5,
    alignItems: "center",
  },
});

export default TaskModal;
