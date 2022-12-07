import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Month from './Month';

function Calendar() {
  const today = new Date();
  const [monthToShow, setMonthToShow] = useState([today.getFullYear(), today.getMonth()]);

  const changeMonth = (change) => {
    if (change === 'prev') {
      const lastMonth = monthToShow.slice();
      lastMonth[1] -= 1;
      setMonthToShow(lastMonth);
    } else if (change === 'next') {
      const nextMonth = monthToShow.slice();
      nextMonth[1] += 1;
      setMonthToShow(nextMonth);
    }
  }

  return (
    <>
      <View style={[styles.container]}>
        <Month changeMonth={changeMonth} date={`${monthToShow.join('-')}-${today.getDate()}`} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
    flex: 1,
    borderWidth: 4,
    backgroundColor: "#fff",
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "flex-start"
  }
});


export default Calendar