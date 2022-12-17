import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';

function Calendar(props) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const date = new Date(...props.date.split('-'));
    const today = new Date();
    const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstMonthDay = firstMonthDate.getDay(); // 0 based
    const lastMonthDay = lastMonthDate.getDay(); // 0 based
    const { activeDay, setActiveDay, changeMonth } = props;

    // This function creates empty dates at the beginning of the month starting Sunday
    const addEmptyDays = (option) => {
        const listOfDays = [];
        const lastMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
        const start = option === 'start' ? lastMonthLastDate.getDate() - firstMonthDay + 1 : 1;
        const end = option === 'start' ? lastMonthLastDate.getDate() : 6 - lastMonthDay;
        for (let i = start; i <= end; i++) {
            listOfDays.push(
                <TouchableOpacity style={styles.day}>
                    <Text style={{ color: 'grey' }}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return listOfDays;
    };

    // This function creates this month's dates
    const addActualDays = () => {
        const listOfDays = [];
        for (let i = 1; i <= lastMonthDate.getDate(); i++) {
            const day = [date.getFullYear(), date.getMonth(), i];
            listOfDays.push(
                <TouchableOpacity
                    style={[(activeDay === day.join('-')) ? styles.activeDay : styles.day,
                    (`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}` === day.join('-')) ? styles.today : styles.day]}
                    onPress={() => {
                        setActiveDay(day.join('-'));
                        console.log('inside month.js on press: ', activeDay)
                        // const newDate = new Date(day[0], day[1], day[2]);
                        // setDate(newDate);
                    }}
                >
                    <Text>{i}</Text>
                </TouchableOpacity>
            );
        }
        return listOfDays;
    }

    return (
        <View style={styles.container}>

            {/* Header displays month, year and month control */}
            <View style={styles.month}>
                <TouchableOpacity
                    style={styles.monthControl}
                    onPress={() => { changeMonth('prev') }}>
                    <Text style={styles.monthControl.text}>&#8249;</Text>
                </TouchableOpacity>
                <View style={styles.monthYear}>
                    <Text style={styles.centerText}>{months[date.getMonth()]}  {date.getFullYear()}</Text>
                </View>
                <TouchableOpacity
                    style={styles.monthControl}
                    onPress={() => { changeMonth('next') }}>
                    <Text style={styles.monthControl.text}>&#8250;</Text>
                </TouchableOpacity>
            </View>

            {/* This section shows the title of weekdays */}
            <View style={styles.weekdays}>
                {days.map((day, index) => {
                    return (
                        <View key={`${props.date}-${index}`} style={styles.daysTitle}>
                            <Text>{day}</Text>
                        </View>
                    )
                })}
            </View>

            {/* This section shows the days of the month with corresponding day of the week */}
            <View style={styles.days}>
                {/* add empty days at the beginning of month if any */}
                {addEmptyDays('start')}
                {/* add actual days of the months */}
                {addActualDays()}
                {/* add empty days at the end of the month if any */}
                {addEmptyDays()}
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: 375,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "flex-start",
    },
    month: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#F0F0F0",
        borderColor: "#ADB7B8",
        borderTopLeftRadius: '5%',
        borderTopRightRadius: '5%',
        borderBottomWidth: 1,
        width: '100%',
        paddingTop: 18,
        paddingBottom: 18
    },
    monthYear: {
        display: 'flex',
        flexDirection: 'row'
    },
    monthControl: {
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
        justifyContent: 'center',
        text: {
            fontSize: 24
        }
    },
    centerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16
    },
    daysTitle: {
        backgroundColor: "#F0F0F0",
        height: 25,
        width: '14.28%',
        alignItems: 'center'
    },
    weekdays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5
    },
    days: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 8
    },
    day: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: '14.28%',
        alignItems: 'center'
    },
    activeDay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'orange',
        height: 30,
        width: '14.28%',
        alignItems: 'center'
    },
    today: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    }
});


export default Calendar