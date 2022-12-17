import React, { useEffect, useState } from "react";
import { View, Text, Divider, Heading, Circle, Pressable } from "native-base";
import { StyleSheet, ActivityIndicator } from "react-native";
import Task, { DeleteButton } from "./Task";
import NewTaskModal from "./NewTaskModal";
import { SwipeListView } from "react-native-swipe-list-view";
import TaskListTabGroup from "./TaskListTabGroup";
import CreateTaskCircle from "./CreateTaskCircle";
import Blockloadingsvg from '../assets/blocksloading.svg'
import { Svg } from 'react-native-svg';

const TaskListContainer = ({
  addTask,
  tasks,
  refetch,
  openNewTask,
  newTask,
  handleDeleteTask,
  loading,
}) => {
  //Selected Tab/View for the container
  //Default is "inprogress", other two are "completed" and "all"
  const [currentTab, switchTab] = useState("inprogress");

  // This data is needed to use for SwipeListView
  const swipeListData = tasks.map((task, index) => ({
    ...task,
    key: index,
  }));

  //this data filters from swipeListData for in-progress tasks
  const swipeListDataInProgress = tasks
    .filter((task, index) => {
      return task.completed === false;
    })
    .map((task, index) => ({
      ...task,
      key: index,
    }));

  //this data filters from swipeListData for complete tasks
  const swipeDataCompleted = tasks
    .filter((task, index) => {
      return task.completed === true;
    })
    .map((task, index) => ({
      ...task,
      key: index,
    }));

  //THIS FUNCTION CONDITIONALLY RENDERS THE SELECTED TAB
  const tabRender = () => {
    switch (currentTab) {
      case "inprogress":
        return (
          <SwipeListView
            style={styles.taskListContainer}
            data={swipeListDataInProgress}
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
                <DeleteButton
                  item={item}
                  rowMap={rowMap}
                  handleDeleteTask={handleDeleteTask}
                />
              );
            }}
            rightOpenValue={-190}
            
          />
        );
      case "completed":
        return (
          <SwipeListView
            style={styles.taskListContainer}
            data={swipeDataCompleted}
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
                <DeleteButton
                  item={item}
                  rowMap={rowMap}
                  handleDeleteTask={handleDeleteTask}
                />
              );
            }}
            rightOpenValue={-190}
          />
        );
      case "all":
        return (
          <SwipeListView
            style={styles.taskListContainer}
            data={swipeListData}
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
                <DeleteButton
                  item={item}
                  rowMap={rowMap}
                  handleDeleteTask={handleDeleteTask}
                />
              );
            }}
            rightOpenValue={-190}
          />
        );
    }
  };

  return (
    <View style={styles.bottomContainer}>
      <View style={{ minHeight: "4%", borderColor: 'black'}}>
        <Heading style={styles.bottomContainerHeading}>Task List</Heading>
        <TaskListTabGroup currentTab={currentTab} switchTab={switchTab} />
        <Divider bgColor="black" thickness={1} orientation="horizontal" />
      </View>
      {/* Fallback Loading for Tasks List */}
      {loading && (
        <View
          style={{
            borderColor: 'black',
            borderWidth: 3,
            minHeight: "85%",
            maxHeight: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {/* Tasks List */}
      {!loading && tabRender()}
        
       <NewTaskModal
          addTask={addTask}
          newTask={newTask}
          openNewTask={openNewTask}
        />
        <CreateTaskCircle
      radius={45}
      borderWidth={2}
      color="#00FF00"
      text="Hello"
      icon="clock"
      onPress={() => openNewTask(true)}
    />
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
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 0,
    padding: 10,
    height: 70,
    margin: 10,
    borderRadius: 10,
  },
  taskListContainer: {
    borderColor: "#E8EEF7",
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  elevation: 2,
    minHeight: "85%",
    maxHeight: "85%",
    borderWidth: 1,
    elevation: 5,
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
});
export default TaskListContainer;
