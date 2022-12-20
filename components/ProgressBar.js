import React, {useRef, useEffect, useState} from "react";
import { Dimensions, StyleSheet, View, Animated} from "react-native";
import Constants from 'expo-constants';


const ProgressBar = ({progress}) => {
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(1)) 

  //function to animate, increment the progress on the progress bar.
  const load = (progress) => {
    Animated.timing(animatedValue, {
      toValue: progress, //final value
      duration: 500, //update value in 500 milliseconds
      useNativeDriver: false,
    }).start();
  };



  useEffect(() => {
    load(progress)
  }, [progress]);

  

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'], //output the width in pixels
    extrapolate: "clamp",
  });

  return (
    <View style={styles.progressBar}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "#FAA946", width }]} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'Column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  progressBar: {
    height: 20,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderWidth: 1,
    borderRadius: 3,
  },
});

export default ProgressBar;