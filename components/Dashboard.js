import { StyleSheet } from "react-native";
import { View, Text, Heading, Divider } from "native-base";
import { useState, useLayoutEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useQuery } from "@apollo/client";
import { GET_TODAYS_TASKS } from "./helpers/queries";
import { useDispatch } from "react-redux";
import { loadTasks } from "../redux/slices/storageSlice";



const progressMessages = {
  0: "Let's create some tasks for today!",
  0.5: "Let's get some tasks done!\n You got this!",
  1: "Always a good start.\n Nice progress!",
  2: "Halfway there!\nLet's go!",
  3: "Nearly done!\nYou got this!",
  4: "Awesome job!\nAll tasks completed!"
}

const Dashboard = () => {
  // this function offsets the passed in date with any time zone difference
  const offsetTime = (dateObj) => {
    const newDate = new Date(dateObj.getTime() - (timezoneOffset * 60000));
    return newDate;
  }

  const username = useSelector((state) => state.storage.username);
  const userID = useSelector((state) => state.storage.user_id)
  const totalTasksLength = useSelector((state) => state.storage.tasks.all.length);
  const completedTasksLength = useSelector((state) => state.storage.tasks.all.filter((task) => task.completed).length)
  const [completionProgress, updateProgress] = useState(0);
  const dispatch = useDispatch();
  const welcomeText = "Welcome Back, \n"
  const [currentMessage, updateMessage] = useState(progressMessages[0])
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const today = offsetTime(now);

  //Preload today's tasks / This prefetches once.
  const { data, error, loading } = useQuery(GET_TODAYS_TASKS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      dispatch(loadTasks(data.getTasksByDay));// update redux toolkit state
    },
    onError: (error) => {
      console.log("Error in loading tasks: ", error);
    },
    variables: { date: today.toISOString().split('T')[0], user_id: userID },
  });

  //this function used to update the message under the progress circle.
  const progressMessageHandler = useCallback(() => {
    if (completionProgress === 0 && !totalTasksLength) {
      return updateMessage(progressMessages[0])
    } else if (completionProgress === 0 && totalTasksLength) {
      return updateMessage(progressMessages[0.5])
    } else if (completionProgress > 0 && completionProgress < 50) {
      return updateMessage(progressMessages[1])
    } else if (completionProgress >= 50 && completionProgress < 60) {
      return updateMessage(progressMessages[2])
    } else if (completionProgress >= 60 && completionProgress < 100) {
      return updateMessage(progressMessages[3])
    } else if (completionProgress === 100) {
      return updateMessage(progressMessages[4])
    }
  }, [completionProgress, totalTasksLength])


  useLayoutEffect(() => {
    if (!isNaN(completedTasksLength / totalTasksLength)) {
      updateProgress((completedTasksLength / totalTasksLength) * 100)
    }
  }, [totalTasksLength, completedTasksLength])

  useLayoutEffect(() => {
    progressMessageHandler()
  }, [completionProgress])


  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <Heading style={styles.heading}>
          {welcomeText}{<Heading style={styles.username}>{username}.</Heading>}{" "}
          {/* <Emoji symbol={0x1f44b} /> */}
        </Heading>
      </View>
      <View style={styles.overviewContainer}>
        <View style={styles.todayContainer} >
          <Heading style={styles.todayHeader}>Today</Heading>
          <Text style={styles.todayDate} fontSize={20}>{now.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          <Text style={styles.todayDate} fontSize={15}>{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(today)}</Text>
        </View>
        <Divider orientation="horizontal" />
        <View style={styles.todayTaskContainer} >
          <View style={styles.taskCountContainer} alignItems="center" >
            <View style={styles.innerTaskCountContainer}><Text fontFamily="FamiljenGrotesk" >Today's Tasks:</Text><Text fontFamily="FamiljenBold" fontSize={20} color="white">{totalTasksLength}</Text></View>
            <View style={styles.innerTaskCountContainer}><Text fontFamily="FamiljenGrotesk" >Tasks Completed:</Text><Text fontFamily="FamiljenBold" fontSize={20} color="white">{completedTasksLength}</Text></View>
          </View>
          {/* <View style={styles.taskCountContainer} alignItems="center"></View> */}
        </View>
        <CircularProgress
          value={isNaN(completionProgress) ? 0 : completionProgress}
          maxValue={100}
          radius={40}
          title={'%'}
          titleColor={'black'}
          activeStrokeColor={'#FAA946'}
          titleStyle={{ fontWeight: 'bold' }}
          progressValueColor={'black'}
        />
        <View style={styles.progressMessageContainer}>
          <Text color="#FDF1CB" textAlign="center" fontFamily="FamiljenBold" fontSize={15} lineHeight={18}  >{currentMessage}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    borderColor: "yellow",
    borderWidth: 0,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "15%",
    borderColor: "red",
    borderWidth: 0,
  },
  heading: {
    textAlign: "center",
    fontFamily: "FamiljenGrotesk",
    padding: 10,
    fontSize: 45,
    width: "100%",
    lineHeight: 50,
    letterSpacing: 0,
  },
  username: {
    fontFamily: "FamiljenBold",
    padding: 10,
    flexWrap: "wrap",
    fontSize: 50,
    height: 25,
    width: "100%",
    lineHeight: 50,
    letterSpacing: 0,
    color: "#FAA946",
  },
  overviewContainer: {
    display: "flex",
    flexDirection: "column",
    borderColor: "darkgrey",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    width: "80%",
    minHeight: "45.5%",
    maxHeight: "45.5%",
    backgroundColor: '#DBE6EC'
  },
  todayContainer: {
    display: "flex",
    flexDirection: "column",
    borderColor: "purple",
    alignItems: "center",
    borderWidth: 0,
    width: "66%",
    height: 100,
    marginTop: 20,
    marginBottom: 0,
  },
  todayHeader: {
    fontFamily: "FamiljenBold",
  },
  todayDate: {
    fontFamily: "FamiljenGrotesk",
  },
  todayTaskContainer: {
    borderColor: "orange",
    borderWidth: 0,
    width: '75%',
    padding: 10,
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-evenly",
  },
  taskCountContainer: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    backgroundColor: "darkgrey",
    borderColor: "rgba(250, 169, 70, .15)",
    display: 'flex',
    flexDirection: 'row',
    width: 270,
    height: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  innerTaskCountContainer: {
    display: 'flex',
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressMessageContainer: {
    width: '65%',
    backgroundColor: "darkgrey",
    borderColor: "rgba(250, 169, 70, .15)",
    borderWidth: 1,
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    marginTop: 10.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  }
});

export default Dashboard;
