import React, { useEffect, useCallback, useMemo, useState } from "react";
import { View, Text, Divider, Heading } from "native-base";
import { StyleSheet, ActivityIndicator } from "react-native";
import Task, { UnderTaskButton } from "./Task";
import { SwipeListView } from "react-native-swipe-list-view";
import TaskListTabGroup from "./TaskListTabGroup";
import { useMutation } from "@apollo/client";
import { COMPLETE_TASK } from "./helpers/mutations";
import { useSelector } from "react-redux";

//Props are passed down from Today component
const TaskListContainer = ({
  refetch,
  handleDeleteTask,
  loading,
}) => {
  //Selected Tab/View for the container
  //Default is "inprogress", other two are "completed" and "all"
  const [currentTab, switchTab] = useState("inprogress");
  const tasks = useSelector((state) => state.storage.tasks.all);
  const inProgressTasks = useSelector((state) => state.storage.tasks.progress);
  const completedTasks = useSelector((state) => state.storage.tasks.completed);
  console.log('tasklistcontainer')

  // const filterTasks = useMemo(() => {
  //   return tasks
  //     .filter((task) => {
  //       if (currentTab === "inprogress") {
  //         return !task.completed;
  //       } else if (currentTab === "completed") {
  //         return task.completed;
  //       } else {
  //         return true;
  //       }
  //     })
  //     .map((task) => ({ ...task, key: task.id })); // add the key property to each task object
  // }, [tasks, currentTab]);

  let DATA;
  if (currentTab === 'inprogress') {
    DATA = inProgressTasks 
  } else if (currentTab === 'completed') {
    DATA = completedTasks
  } else {
    DATA = tasks
  }


  // const filterTasks = useCallback(() => {
  //   console.log('filter task')
  //   switch (currentTab) {
  //     case "inprogress":
  //       return inProgressTasks;
  //     case "completed":
  //       return completedTasks;
  //     case "all":
  //       return tasks;
  //     default:
  //         return tasks;
  //   } 
  // }, [currentTab])


  const [completeTask] = useMutation(COMPLETE_TASK, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.log("Error Completing Task: ", err);
    },
  });


  return (
    <View style={styles.bottomContainer}>
      <View style={{ minHeight: "7.25%", maxHeight: '7.25%', borderColor: "black" }}>
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
      {/* {!loading && tasks.length < 1 &&
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
     } */}
      {/* Tasks List */}
      {!loading && (
        <SwipeListView
          style={styles.taskListContainer}
          data={DATA}
          windowSize={5}
          renderItem={({ item }, rowMap) => {
            return (
              <Task
                description={item.task_description}
                title={item.task_name}
                startTime={item.time_start}
                completed={item.completed}
                endTime={item.time_finished}
                taskId={item.id}
                key={item.id}
                refetch={refetch}
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
            completeTask({ variables: { taskId: rowData } });
            console.log("rowData:", typeof rowData);
            // console.log(rowKey);
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
    marginTop: 5,

    marginBottom: 10,
    textAlign: "center",
  },
  taskListContainer: {
    borderBottomColor: 'black',
    minHeight: "85%",
    height: "85%",
    maxHeight: "85%",
    borderBottomWidth: 1,
  },
  createTaskButtonContainer: {
    position: "absolute",
    width: 150,
    height: 150,
  },
  createTaskButton: {
    borderColor: "black",
    borderWidth: 0,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "black",
    paddingTop: 5,
    backgroundColor: "orange",
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
})
export default TaskListContainer;
