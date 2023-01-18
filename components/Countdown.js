import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

function Countdown({ startTime }) {
  const [remainingTime, setRemainingTime] = useState(startTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24);
  const hours = Math.floor((remainingTime / 1000 / 60 / 60) % 24);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return (
    <View style={styles.Container}>
      <View style={styles.innerContainer}>
        <Text style={styles.timeText}>
          {`${days < 10 ? '0' : ''}${days}:${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
        </Text>
        <Text style={styles.timeTextLabel}>
          Days : Hours : Minutes : Seconds
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  Container: {
    borderColor: 'darkgrey',
    borderWidth: 1,
    minWidth: '75%',
    maxWidth: '75%',
    margin: 20,
    height: 65,
    borderRadius: 10,
  },
  innerContainer: {
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 0
  },
  timeText: {
    fontFamily: 'FamiljenBold',
    fontSize: '32',
    textAlign: 'center',
  },
  timeTextLabel: {
    fontFamily: 'FamiljenGrotesk',
    fontSize: '8',
    textAlign: 'center',
  }
})

export default Countdown;
