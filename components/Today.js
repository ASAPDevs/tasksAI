import React, { useEffect, useState } from "react";
import { View, Text, Progress, Box } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import banner from "../assets/banner.jpg";

function Today() {
  // Figure out where we pull date or refetch date
  const [date, setDate] = useState(new Date().toDateString());
  // Need alg to read and determine (completed tasks) / (total tasks)
  const [progress, setProgress] = useState(0);

  const [tasks, setTasks] = useState([]);

  // get req to backend to grab tasks for that day (Post req?) or shape what we need in initial gql req
  //   useEffect(() => {
  //     fetch("/endpoint")
  //       .then((res) => res.json())
  //       .then((data) => setTasks(data))
  //       .catch((err) => console.log(err));
  //   }, [date]);

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        style={styles.topContainer}
        // source={banner}
        resizeMode="cover"
      >
        <View>
          <Text style={styles.topContainerText}>Today:</Text>
          <Text>{date}</Text>
        </View>
        <Box w="50%" p="3" _text={{ textAlign: "center" }}>
          <Progress size="lg" value={progress} />
          <Text> Daily Progress: {progress}%</Text>
        </Box>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flexDirection: "row",
    // textAlign: "center",
  },
  topContainer: {
    bottom: 700,
    left: -214,
    position: "absolute",
    width: "100%",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    height: 100,
    paddingHorizontal: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topContainerText: {
    fontSize: 30,
    paddingVertical: 18,
    // color: "white",
  },
});

export default Today;
