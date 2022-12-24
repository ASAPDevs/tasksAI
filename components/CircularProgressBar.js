import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Svg } from 'react-native-svg';

const CircularProgressBar = ({ progress }) => {
  const circleRadius = 50;
  const circumference = circleRadius * 2 * Math.PI;

  const progressAnimation = useRef(new Animated.Value(circumference)).current;

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDasharray = Animated.add(
    Animated.multiply(Animated.divide(progressAnimation, 100), circumference),
    0
  );

  const progressStyle = {
    strokeDasharray: strokeDasharray,
  };

  return (
    <View style={styles.container}>
      <Svg width={100} height={100}>
        <Svg.Circle
          cx={50}
          cy={50}
          r={circleRadius}
          stroke="#ddd"
          strokeWidth={10}
          fill="none"
        />
        <Svg.Circle
          cx={50}
          cy={50}
          r={circleRadius}
          stroke="#3498db"
          strokeWidth={10}
          fill="none"
          {...{ style: progressStyle }}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircularProgressBar;
