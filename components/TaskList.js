import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Task from './Task';
import { UnderTaskButton } from './Task';

const TaskList = ({ currentTab, handleDeleteTask, refetch, completeTask }) => {
  const tasks = useSelector((state) => state.storage.tasks.all);
  const inProgressTasks = useSelector((state) => state.storage.tasks.progress);
  const completedTasks = useSelector((state) => state.storage.tasks.completed);

  let DATA;
  if (currentTab === 'inprogress') {
    DATA = inProgressTasks 
  } else if (currentTab === 'completed') {
    DATA = completedTasks
  } else {
    DATA = tasks
  }

  return (
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
  )
}

const styles = StyleSheet.create({
  taskListContainer: {
    borderBottomColor: 'black',
    minHeight: "85%",
    height: "85%",
    maxHeight: "85%",
    borderBottomWidth: 1,
  },
})

export default TaskList