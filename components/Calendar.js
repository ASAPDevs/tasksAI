import { View } from 'native-base';
import { StyleSheet } from 'react-native';
import { Modal } from "native-base";
import React, { useState } from 'react';
import Month from './Month';

function Calendar({ calendarModal, openCalendarModal, setDate, date }) {
  const today = date;
  const [activeDay, setActiveDay] = useState(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
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

  const changeDay = () => {
    const arr = activeDay.split('-');
    const activeYearMonthDate = arr.map(str => parseInt(str));
    const activeDate = new Date(activeYearMonthDate[0], activeYearMonthDate[1], activeYearMonthDate[2]);
    setDate(activeDate);
  }

  return (
    <>
      <Modal top={5} isOpen={calendarModal} onClose={() => {
        openCalendarModal(false)
        changeDay();
      }}>
        <View style={styles.container}>
          <Month
            changeMonth={changeMonth}
            date={`${monthToShow.join('-')}-${today.getDate()}`}
            setDate={setDate}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
          />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F0F0",
    borderColor: "#ADB7B8",
    borderWidth: 1,
    padding: 10,
    borderRadius: '5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});


export default Calendar