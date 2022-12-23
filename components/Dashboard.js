import { StyleSheet } from "react-native";
import { View, Text, Heading, Center, Switch, Divider } from "native-base";
import { useEffect, useState } from "react";
import { updateUsername } from "../redux/slices/storageSlice";
import { useSelector } from "react-redux";
import Emoji from "./helpers/Emoji";
import CircularProgress from 'react-native-circular-progress-indicator';


const Dashboard = () => {
  const username = useSelector((state) => state.storage.username);
  const today = new Date();
  const welcomeText = "Welcome Back, \n"

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
          <Text style={styles.todayDate} fontSize={20}>{today.toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          <Text style={styles.todayDate} fontSize={15}>{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(today)}</Text>
        </View>
        <Divider orientation="horizontal" />
        <View style={styles.todayTaskContainer} >
          <View style={styles.taskCountContainer} alignItems="center" >
            <View style={styles.innerTaskCountContainer}><Text fontFamily="FamiljenGrotesk" >Today's Tasks:</Text><Text fontFamily="FamiljenBold" fontSize={20} color="white">10</Text></View>
            <View style={styles.innerTaskCountContainer}><Text fontFamily="FamiljenGrotesk" >Tasks Completed:</Text><Text fontFamily="FamiljenBold" fontSize={20} color="white">5</Text></View>
            </View>
          {/* <View style={styles.taskCountContainer} alignItems="center"></View> */}
        </View>
        <CircularProgress 
        value={50}
        maxValue={100}
        radius={40}
        title={'%'}
        titleColor={'black'}
        activeStrokeColor={'#FAA946'}
        titleStyle={{fontWeight: 'bold'}} 
        progressValueColor={'black'}/>
        
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
    height: "40%",
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
  }
});

export default Dashboard;
