import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { View, Text, Box, Pressable } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { loadTasks, deleteTask, addTask } from "../redux/slices/storageSlice";
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { CREATE_TASKS, DELETE_TASK } from "./helpers/mutations";
import { FontAwesome } from "@expo/vector-icons";
import TaskListContainer from "./TaskListContainer";
import Calendar from "./Calendar";
import ProgressBar from "./ProgressBar";
import NewTaskModal from "./NewTaskModal";
import CreateTaskCircle from "./CreateTaskCircle";
import { getTimeOfDay } from "./helpers/dateHelperFunc";

const Today = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset();
  // this function offsets the passed in date with any time zone difference
  const offsetTime = (dateObj) => {
    const newDate = new Date(dateObj.getTime() - timezoneOffset * 60000);
    return newDate;
  };

  // Figure out where we pull date or refetch date
  const [date, setDate] = useState(today);
  // Need alg to read and determine (completed tasks) / (total tasks)
  const [progress, setProgress] = useState(0);
  const [newTask, openNewTask] = useState(false);
  const [calendarModal, openCalendarModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // prevDay will determine if the user is looking at pass days,
  // if true, nothing should be editable
  const [prevDay, changePrevDay] = useState(compareDateWithToday);

  //maps to redux storage Slice.
  const tasks = useSelector((state) => state.storage.tasks.all);
  const completedTasks = tasks.reduce((acc, task) => {
    if (task.completed) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const userID = useSelector((state) => state.storage.user_id);

  const dispatch = useDispatch();

  const compareDateWithToday = () => {
    const todayTime = offsetTime(today);
    const todayFirstMoment = new Date(
      todayTime.getFullYear(),
      todayTime.getMonth(),
      todayTime.getDate()
    );
    return offsetTime(todayFirstMoment).getTime() > offsetTime(date).getTime();
  };

  const { data, error, loading, refetch } = useQuery(GET_TODAYS_TASKS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      dispatch(loadTasks(data.getTasksByDay)); // update redux toolkit state
    },
    onError: (error) => {
      console.log("Error in loading tasks: ", error);
    },
    variables: { date: date.toISOString().split("T")[0], user_id: userID },
  });

  const [createTaskMutation] = useMutation(CREATE_TASKS, {
    onCompleted: (data) => {
      dispatch(addTask(data.createTask));
    },
    onError: (err) => {
      console.log("Error Creating Task: ", err);
    },
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: (data) => {
      console.log(
        "data.deleteTask.id: ",
        data.deleteTask.id,
        typeof data.deleteTask.id
      );
      dispatch(deleteTask(data.deleteTask.id));
    },
    onError: (err) => {
      console.log("Error Deleting Task: ", err);
    },
  });

  // this function converts the date state to mm/dd/yy format
  // const convertDateTitle = () => {
  //   const yy = date.getFullYear();
  //   const mm =
  //     date.getMonth() + 1 < 10
  //       ? `0${date.getMonth() + 1}`
  //       : date.getMonth() + 1;
  //   const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  //   return `${mm}/${dd}/${yy % 100}`;
  // };

  const handleDeleteTask = (taskId) => {
    console.log("type of task id in handleDeleteTask: ", typeof taskId);
    deleteTaskMutation({
      variables: { taskId: taskId },
    });
  };

  //this handler creates a new task using the current state inputs and sends it to the useMutation function
  //then closes the modal
  const addTaskHandler = (
    taskTitle,
    taskDescription,
    startTime,
    endTime,
    category
  ) => {
    const newTask = {
      task_name: taskTitle,
      task_description: taskDescription,
      time_start: startTime.toString(),
      date: date.getTime().toString(),
      time_finished: endTime.toString(),
      time_of_day: getTimeOfDay(startTime.toString()),
      completed: false,
      category: category,
      user_id: Number(userID),
    };
    // console.log("start and end in addTaskHandler: ", startTime, endTime);
    createTaskMutation({ variables: { task: newTask } });
    openNewTask(false);
  };

  // useEffect to update and render progress bar
  useEffect(() => {
    completedTasks
      ? setProgress(((completedTasks / tasks.length) * 100).toFixed(2))
      : null;
    changePrevDay(compareDateWithToday);
  }, [tasks, date]);

  return (
    <View style={styles.mainContainer}>
      <ImageBackground style={styles.topContainer} resizeMode="cover">
        <View alignItems="center">
          <Text style={styles.topContainerText}>
            {date.toLocaleDateString()}
          </Text>
          <Pressable
            onPress={() => openCalendarModal(true)}
            style={styles.calendarRow}
          >
            <FontAwesome name="calendar" size={24} color="white" />
          </Pressable>
        </View>
        <Box w="50%" p="3" top={1} _text={{ textAlign: "center" }}>
          <ProgressBar progress={progress} />
          <Text style={styles.progressText}>
            {" "}
            Daily Progress: {!isNaN(progress) ? progress : "0.00"}%
          </Text>
          <View
            overflow="hidden"
            borderColor="grey"
            borderWidth={1}
            borderRadius={2.5}
            padding={0.5}
            justifyContent="center"
            alignItems="center"
            top={1}
            bgColor="darkgrey"
          >
            <View flexDirection="row">
              <Text fontSize={15} fontFamily="FamiljenGrotesk">
                {" "}
                Total Tasks:{" "}
              </Text>
              <Text fontSize={17} fontFamily="FamiljenBold" bottom={0.5}>
                {tasks.length}
              </Text>
            </View>
            <View
              width="105%"
              borderTopColor="grey"
              borderTopWidth={1}
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
            >
              <Text fontFamily="FamiljenGrotesk" fontSize={15} top={0.25}>
                {" "}
                Tasks Finished:{" "}
              </Text>
              <Text
                fontFamily="FamiljenBold"
                fontSize={17}
                top={0.25}
                style={{ color: "#fac146" }}
              >
                {completedTasks}
              </Text>
            </View>
          </View>
        </Box>
      </ImageBackground>

      <Calendar
        calendarModal={calendarModal}
        openCalendarModal={openCalendarModal}
        setDate={setDate}
        date={date}
      />
      <TaskListContainer
        date={date}
        refetch={refetch}
        today={today}
        prevDay={prevDay}
        addTask={addTask}
        loading={loading}
        handleDeleteTask={handleDeleteTask}
        changePrevDay={changePrevDay}
      />
      <NewTaskModal
        date={date}
        addTaskHandler={addTaskHandler}
        newTask={newTask}
        openNewTask={openNewTask}
      />
      {!prevDay && (
        <CreateTaskCircle
          radius={45}
          borderWidth={2}
          color="#00FF00"
          text="Hello"
          icon="clock"
          onPress={() => openNewTask(true)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center",
    zIndex: -1,
  },
  topContainer: {
    width: "110%",
    borderBottomColor: "black",
    borderWidth: 1,
    maxHeight: 135,
    paddingHorizontal: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DBE6EC",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  topContainerText: {
    fontSize: 30,
    paddingVertical: 18,
    fontFamily: "FamiljenGrotesk",
    // color: "white",
  },
  calendarRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    marginTop: -5,
    borderRadius: 8,
    borderColor: "darkgrey",
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.175,
    shadowRadius: 3.84,
    elevation: 5,
    width: 100,
  },
  progressText: {
    fontSize: 13,
    paddingTop: 4,
  },
});

export default Today;
