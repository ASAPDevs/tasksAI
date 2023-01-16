import { StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import { View, Text, Heading, Divider, Button, ScrollView, Pressable, Icon, Image } from "native-base";
import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_TODAYS_TASKS, GET_DATA_ML, GET_LAST_GENERATION} from "./helpers/queries";
import { GENERATE_DATA_ML } from "./helpers/mutations";
import { Fontisto } from '@expo/vector-icons';
import { useDispatch, useSelector} from "react-redux";
import { loadTasks, generateRec, updateGenerationCooldown } from "../redux/slices/storageSlice";
import taskRobot from '../assets/taskrobot.png'
import * as SecureStore from 'expo-secure-store';
import { useGetLastGeneration } from "./hooks/useGetLastGeneration";



const progressMessages = {
  0: "Let's create some tasks for today!",
  0.5: "Let's get some tasks done!\n You got this!",
  1: "Always a good start.\n Nice progress!",
  2: "Halfway there!\nLet's go!",
  3: "Nearly done!\nYou got this!",
  4: "Awesome job!\nAll tasks completed!"
}

const Dashboard = ({navigation}) => {
  // this function offsets the passed in date with any time zone difference
  const offsetTime = (dateObj) => {
    const newDate = new Date(dateObj.getTime() - (timezoneOffset * 60000));
    return newDate;
  }
  const username = useSelector((state) => state.storage.username);
  const userID = useSelector((state) => state.storage.user_id)
  const totalTasks = useSelector((state) => state.storage.tasks.all);
  const completedTasks = totalTasks.reduce((acc, task) => {
    if (task.completed) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const [completionProgress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const welcomeText = "Welcome Back, \n"
  const [currentMessage, updateMessage] = useState(progressMessages[0])
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const today = offsetTime(now);

  //Preload today's tasks / This prefetches once.
  const { data, error, loading, refetch } = useQuery(GET_TODAYS_TASKS, {
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
    if (completionProgress === 0 && !totalTasks) {
      return updateMessage(progressMessages[0])
    } else if (completionProgress === 0 && totalTasks) {
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
  }, [completionProgress, totalTasks])


  useLayoutEffect(() => {
    progressMessageHandler()
  }, [completionProgress])


  useLayoutEffect(() => {
    completedTasks
    ? setProgress(((completedTasks / totalTasks.length) * 100).toFixed(2))
    : setProgress(0);
  }, [totalTasks, completedTasks])

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={{alignItems: 'center', height:'150%', }} >
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
              <View style={styles.innerTaskCountContainer}><Text fontFamily="FamiljenGrotesk" >Today's Tasks:</Text><Text fontFamily="FamiljenBold" fontSize={20} color="white">{totalTasks.length}</Text></View>
              <View style={styles.innerTaskCountContainer}><Text fontFamily="FamiljenGrotesk" >Tasks Completed:</Text><Text fontFamily="FamiljenBold" fontSize={20} color="white">{completedTasks}</Text></View>
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
        
        <MLContainer userID={userID} />
      </ScrollView>
    </View>
  );
};



const MLContainer = ({ userID }) => {
  const nextGeneration = useSelector((state) => state.storage.nextGeneration);
  const [currentTab, switchTab] = useState("recommendations")
  const [generationStatus, toggleGenerationStatus] = useState(false);
  const [invalidGen, toggleInvalidGen] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const dispatch = useDispatch()


  const { data, error, refetch} = useQuery(GET_DATA_ML, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      toggleLoading(false);
      dispatch(generateRec(data.getDataML.recommendations))
    },
    onError: (error) => {
      console.log("Error: ", error)
    },
    variables: {user_id: userID}
  })
  

  const [generateDataML] = useMutation(GENERATE_DATA_ML, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      refetch();
      // fetch({variables: {user_id: userID}});
      dispatch(updateGenerationCooldown(data.generateDataML.lastGeneration))
    },
    onError: (error) => {
      console.log("Error: ", error)
    }
  })

  function generateDataHandler() {
    if (generationStatus === true) {
      dispatch(generateRec([]))
      toggleLoading(true);
      generateDataML({variables: {user_id: userID}})
    } else {
      toggleInvalidGen(true);
    }
  }

  useEffect(() => {
    if (Date.now() > nextGeneration) toggleGenerationStatus(true);
    else toggleGenerationStatus(false);
  }, [nextGeneration])

  return (
    <View style={styles.recommendationsContainer}>
      <View style={styles.recHeaderContainer}>
        <Heading style={styles.recHeader}></Heading>
        <View flexDirection="row" >
          <Button onPress={() => switchTab('recommendations')} >Recommendations</Button>
          <Button onPress={() => switchTab('metrics')} >Metrics</Button>
        </View>
      </View>
      {/* Conditional Render Between Recommendations & Metrics */}
      {currentTab === 'recommendations' && <RecommendationsContainer userID={userID} loading={loading} refetch={refetch} toggleLoading={toggleLoading} />}
      {currentTab === 'metrics' && <MetricsContainer userID={userID} loading={loading} refetch={refetch} toggleLoading={toggleLoading} />}
     <View style={styles.regenerateContainer}>
        <TouchableOpacity marginBottom={2}
        onPress={generateDataHandler}
        >
            <Icon as={Fontisto} color={generationStatus ? "#FAA946" : "grey"} name="spinner-rotate-forward" size="xl" />
        </TouchableOpacity>
      <Text fontFamily="FamiljenGrotesk" textAlign="center" fontSize={12} color={invalidGen ? 'red.500' : null}>You can only regenerate AI metrics/recommendations{"\n"} once every three days.</Text>
     </View>
    </View>
  )
}



const MetricsContainer = ({userID, loading, toggleLoading}) => {
  return (
    <View style={styles.innerRecContainer}>
      {loading && <LoadingComp />}
      {!loading && <Text>Metrics</Text>}
    </View>
  )
}


const RecommendationsContainer = ({userID, loading, toggleLoading}) => {
  const recommendations = useSelector((state) => state.storage.recommendations)
  const dispatch = useDispatch();

  const Recommendation = ({text}) => {
    return (
      <View style={styles.recommendationItemContainer}>
        <Text style={styles.recommendationItem}>{text}</Text>
      </View>
    )
  }

  return (
    <View style={styles.innerRecContainer}>
            {loading && <LoadingComp />}
            {recommendations && 
            recommendations.map((text, index) => <Recommendation key={index} text={text} />)}
    </View>
  )
}





const LoadingComp = () => {
  return (
    <View alignItems="center">
      <Image source={taskRobot} alt="LoadingRobot" height={100} width={100} />
      <Heading fontFamily="FamiljenBold" fontSize={20}>Analyzing Tasks</Heading>
      <ActivityIndicator style={{alignSelf: 'center', marginTop: 30}} size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    borderColor: "yellow",
    borderWidth: 0,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    position: "relative",
    flex: 1,
    // overflow: "visible"
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "15%",
    borderColor: "red",
    borderWidth: 0
  },
  heading: {
    textAlign: "center",
    fontFamily: "FamiljenGrotesk",
    padding: 10,
    fontSize: 25,
    width: "100%",
    lineHeight: 30,
    letterSpacing: 0,
  },
  username: {
    fontFamily: "FamiljenBold",
    padding: 10,
    flexWrap: "wrap",
    fontSize: 30,
    height: 25,
    width: "100%",
    lineHeight: 33,
    letterSpacing: 0,
    color: "#FAA946",
  },
  recommendationsContainer: {
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
    marginTop: 50,
    marginBottom: 30,
    height: 450,
    backgroundColor: '#DBE6EC',
    paddingBottom: 10,
    position: "relative",
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
    paddingBottom: 15,
    marginTop: -80,
    height: 355,
    backgroundColor: '#DBE6EC',
  },
  recHeaderContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 3.5,
    borderColor: 'darkgrey',
    borderBottomWidth: 0.5
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
  recHeader: {
    fontFamily: "FamiljenBold",
    fontSize: 20
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
    height: "15%",
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
  },
  innerRecContainer: {
    width: "100%",
    padding: 5,
    alignItems: "center",
    paddingTop: 20,
    borderColor: "darkgrey",
    borderWidth: 0,
    borderBottomWidth: 1,
    minHeight: 325,
    maxHeight: 325
  },
  recommendationItemContainer: {
    width: "90%",
    margin: 6,
    padding: 8,
    textAlign: 'center',
    backgroundColor: "darkgrey",
    borderColor: "rgba(250, 169, 70, .15)",
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
    maxHeight: '33%'
  },
  recommendationItem: {
    fontFamily: "FamiljenGrotesk",
    fontSize: 15,
    textAlign: 'center'
  },
  regenerateContainer: {
    alignItems: 'center',
    marginTop: 10,
  }
});

export default Dashboard;
