import { Text, View, Pressable, Button, TouchableOpacity } from 'native-base'
import { StyleSheet } from 'react-native'
import React, { useState } from 'react'

function Calendar() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const [activeDay, setActiveDay] = useState(today.getDate());
  const firstMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const firstMonthDay = firstMonthDate.getDay(); // 0 based

  console.log(activeDay)

  const addEmptyDays = () => {
    const listOfDays = [];
    for (let i = 0; i < firstMonthDay; i++) {
      listOfDays.push(
        <View style={styles.day}>
          <Pressable
            onPress={() => { console.log('hi') }}>
            <Text>none</Text>
          </Pressable>
        </View >
      );
    }
    return listOfDays;
  };

  const addActualDays = () => {
    const listOfDays = [];
    for (let i = 1; i <= lastMonthDate.getDate(); i++) {
      listOfDays.push(
        <View style={styles.day}>
          <Pressable
            onPress={() => { console.log('hello') }}>
            <Text>{i}</Text>
          </Pressable>
        </View >
      );
    }
    return listOfDays;
  }

  return (
    <View style={styles.container}>
      <View style={styles.month}>
        <Pressable>
          <Text>&#8249;</Text>
        </Pressable>
        <Text>{months[today.getMonth()]}</Text>
        <Pressable>
          <Text>&#8250;</Text>
        </Pressable>
      </View>

      <View style={styles.weekdays}>
        {days.map(day => {
          return (
            <View>
              <Text>{day}</Text>
            </View>
          )
        })}
      </View>

      <View style={styles.days}>
        {/* add empty days at the beginning of month */}
        {addEmptyDays()}
        {/* add actual days of the months */}
        {addActualDays()}
      </View>
    </View >
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
  },
  month: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'green',
    borderWidth: 3,
    borderColor: 'orange',
    width: '100%',
    padding: 10
  },
  weekdays: {
    backgroundColor: 'orange',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  days: {
    backgroundColor: 'purple',
    borderWidth: 2,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  day: {
    backgroundColor: 'pink',
    borderWidth: 1,
    height: 20,
    width: '14.28%'
  },
  input: {
    border: '1px solid black'
  }
});


export default Calendar