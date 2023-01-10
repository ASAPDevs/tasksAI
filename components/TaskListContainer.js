import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Divider, Heading } from "native-base";
import { StyleSheet, ActivityIndicator } from "react-native";
import Task from "./Task";
import UnderTaskButton from "./UnderTaskButton";
import { SwipeListView } from "react-native-swipe-list-view";
import TaskListTabGroup from "./TaskListTabGroup";
import { useMutation } from "@apollo/client";
import { COMPLETE_TASK } from "./helpers/mutations";
import { useSelector, useDispatch } from "react-redux";
import { completeTask } from "../redux/slices/storageSlice";

//Props are passed down from Today component
const TaskListContainer = ({
  prevDay,
  today,
  date,
  refetch,
  changePrevDay,
  handleDeleteTask,
  loading,
}) => {
  // Selected Tab/View for the container
  // Default is "inprogress", other two are "completed" and "all"
  const [currentTab, switchTab] = useState("inprogress");
  const tasks = useSelector((state) => state.storage.tasks.all);
  const dispatch = useDispatch()

  const filterTasks = useCallback(() => {
    switch (currentTab) {
      case "inprogress":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
      case "all":
        return tasks;
      default:
        return tasks;
    }
  }, [currentTab, tasks])

  const DATA = useMemo(() => filterTasks(), [currentTab, tasks])

  const [completeTaskMutation] = useMutation(COMPLETE_TASK, {
    onCompleted: (data) => {
      console.log("Data in frontend Complete Task: ", data.completeTask)
      dispatch(completeTask(data.completeTask.id))
    },
    onError: (err) => {
      console.log("Error Completing Task: ", err);
    },
  });

  return (
    <View style={styles.bottomContainer}>
      <View style={{ minHeight: "8%", maxHeight: '8.5%', borderColor: "black", alignItems: "center", justifyContent: "center" }}>
        <Heading style={styles.bottomContainerHeading}>Task List</Heading>
        <TaskListTabGroup currentTab={currentTab} switchTab={switchTab} />
        <Divider bgColor="black" thickness={1} orientation="horizontal" />
      </View>
      {/* Fallback Loading for Tasks List */}
      {loading && (
        <View
          style={{
            borderColor: "black",
            borderWidth: 0,
            minHeight: "85%",
            maxHeight: "85%",
            height: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {/* Fallback for empty tasks */}
      {!loading && DATA.length < 1 &&
        <View
          style={{
            borderColor: "black",
            borderWidth: 0,
            minHeight: "85%",
            maxHeight: "85%",
            height: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>No Tasks To Be Shown!</Text>
        </View>
      }
      {/* Tasks List */}
      {!loading && (
        <SwipeListView
          style={styles.taskListContainer}
          data={DATA}
          windowSize={5}
          renderItem={({ item }, rowMap) => {
            return (
              <Task
                prevDay={prevDay}
                date={date}
                refetch={refetch}
                category={item.category}
                description={item.task_description}
                title={item.task_name}
                startTime={item.time_start}
                completed={item.completed}
                endTime={item.time_finished}
                taskId={item.id}
                key={item.id}
              />
            );
          }}
          renderHiddenItem={({ item }, rowMap) => {
            return (
              <UnderTaskButton
                item={item}
                key={item.id}
                rowMap={rowMap}
                handleDeleteTask={handleDeleteTask}
              />
            );
          }}
          rightOpenValue={-190}
          leftOpenValue={100}
          leftActivationValue={80}
          // onLeftAction={(data, rowMap) => console.log("Left: ", rowMap.item)}
          onLeftAction={(rowData, rowKey) => {
            console.log("rowData:", rowData);
            console.log("rowKey:", Object.keys(rowKey)[0]);
            completeTaskMutation({ variables: { taskId: rowData } });
          }}

        // onSwipeValueChange={() => console.log("SwipeLEFT")}
        // leftActionValue={() => console.log("Left")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    paddingTop: 0,
    display: "flex",
    alignContent: "center",
    flexDirection: "column",
    width: "120%",
    minHeight: "77.5%",
    maxHeight: "77.5%",
  },
  bottomContainerHeading: {
    fontFamily: "FamiljenGrotesk",
    fontWeight: "bold",
    fontSize: 25,
    marginTop: "2%",
    marginBottom: 10,
    textAlign: "center",
  },
  taskListContainer: {
    borderBottomColor: 'black',
    minHeight: "85%",
    maxHeight: "85%",
    borderBottomWidth: 0,
  },
})
export default TaskListContainer;
