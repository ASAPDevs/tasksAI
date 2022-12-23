import { StyleSheet } from "react-native";
import { View, Text, Heading, Center, Switch, Divider } from "native-base";
import { useEffect, useState } from "react";
import { updateUsername } from "../redux/slices/storageSlice";
import { useSelector } from "react-redux";
import Emoji from "./helpers/Emoji";
import CircularProgressBar from './CircularProgressBar'


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
        <View style={styles.todayTaskContainer} >
          <View style={styles.taskCountContainer} alignItems="center" ><Text fontFamily="FamiljenGrotesk" >Today's Tasks:</Text><Text color="white">10</Text></View>
          <View style={styles.taskCountContainer} alignItems="center"><Text fontFamily="FamiljenGrotesk" >Tasks Completed:</Text><Text color="red.800">5</Text></View>
        </View>
        <CircularProgressBar progress={10} />
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
    borderColor: "orange",
    alignItems: "center",
    borderWidth: 2,
    width: "110%",
    height: "40%"
  },
  todayContainer: {
    display: "flex",
    flexDirection: "column",
    borderColor: "purple",
    alignItems: "center",
    borderWidth: 0,
    width: "66%",
    height: 100
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
    justifyContent: "space-evenly",
  },
  taskCountContainer: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    backgroundColor: "darkgrey",
    borderColor: "rgba(250, 169, 70, .35)",
    maxWidth: 140,
    minWidth: 140,
    height: 55,
    justifyContent: 'center',
  }
});

export default Dashboard;
