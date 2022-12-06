import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Month from './Month';

function Calendar() {
  const today = new Date();

  return (
    <Month />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 4,
    backgroundColor: "#fff",
    position: 'absolute',
    top: 100,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "flex-start",
  }
});


export default Calendar