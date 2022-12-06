import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Month from './Month';

function Calendar() {
  const today = new Date();
  const [monthToShow, setMonthToShow] = useState([today.getFullYear(), today.getMonth()]);
  const [lastMonth, setLastMonth] = useState([today.getFullYear(), today.getMonth() - 1]);
  const [nextMonth, setNextMonth] = useState([today.getFullYear(), today.getMonth() + 1]);
  const [lastMonthClicked, changeLastMonthClicked] = useState(false);
  const [nextMonthClicked, changeNextMonthClicked] = useState(false);

  console.log(lastMonthClicked)

  const changeMonth = (change) => {
    if (change === 'prev') {
      changeLastMonthClicked(true);
      console.log(lastMonthClicked);
    } else if (change === 'next') {
      changeNextMonthClicked(true);
    }
  }

  return (
    <>
      <View style={lastMonthClicked ? [{ left: 0 }] : [styles.container, styles.prevMonth]}>
        <Month changeMonth={changeMonth} date={`${lastMonth.join('-')}-01`} />
      </View>
      <View style={lastMonthClicked ? [{ left: '100%' }] : [styles.container]}>
        <Month date={`${monthToShow.join('-')}-${today.getDate()}`} />
      </View>
      <View style={[styles.container, styles.nextMonth]}>
        <Month changeMonth={changeMonth} date={`${nextMonth.join('-')}-01`} />
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
  },
  prevMonth: {
    left: '-100%',
    backgroundColor: 'yellow'
  },
  nextMonth: {
    left: '100%',
    backgroundColor: 'cyan'
  },
  showLastMonth: {
    left: 0
  }
});


export default Calendar