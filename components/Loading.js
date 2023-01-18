import { ActivityIndicator, Animated, StyleSheet, LayoutAnimation,} from "react-native"
import {useEffect} from 'react';
import {Heading, Image, View, Text} from 'native-base';
import taskRobot from '../assets/taskrobot.png'




const LoadingComponent = () => {
  const animation = new Animated.Value(1)

  useEffect(() => {
    const shrinking = Animated.timing(animation, {
      toValue: 0.95,
      duration: 800,
      useNativeDriver: true
    });
    const growing = Animated.timing(animation, {
      toValue: 1.05,
      duration: 800,
      useNativeDriver: true
    });

    Animated.sequence([shrinking, growing]).start(() => {
      Animated.sequence([shrinking, growing]).start()
    });
  }, [animation])

  const animatedStyle = {
    transform: [{ scale: animation }]
  }

  return (
    <View style={styles.container}>
      <Animated.View alignItems="center" style={animatedStyle}>
      <Image source={taskRobot} alt="LoadingRobot" height={155} width={155} />
      <Text marginTop={-3} marginBottom={-5} fontFamily="FamiljenGrotesk" fontSize={20}>Analyzing Tasks</Text>
      <ActivityIndicator color="#FAA946" style={{alignSelf: 'center', marginTop: 30}} size={"large"}/>
    </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'darkgrey',
    borderWidth: 0,
    borderRadius: 150,
    width: 300,
    height: 300
  }
  });

export default LoadingComponent;