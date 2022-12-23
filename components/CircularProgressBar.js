import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

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

  const strokeDasharray = Animated.multiply(
    Animated.divide(progressAnimation, 100),
    circumference
  );

  const progressStyle = {
    strokeDasharray: `${strokeDasharray} ${circumference}`,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.border]}>
        <View style={[styles.progress, progressStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 10,
    borderColor: '#ddd',
  },
  progress: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    position: 'absolute',
    left: 0,
    top: 0,
    transform: [{ rotate: '-90deg' }],
    backgroundColor: '#3498db',
  },
});

export default CircularProgressBar;
