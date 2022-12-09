import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';

function Calendar(props) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const date = new Date(...props.date.split('-'));
    const today = new Date();
    const [activeDay, setActiveDay] = useState(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
    const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstMonthDay = firstMonthDate.getDay(); // 0 based
    const lastMonthDay = lastMonthDate.getDay(); // 0 based
    changeMonth = props.changeMonth;

    // This useEffect changes the default highlighted day to today
    // if the month on the calendar matches the current month
    useEffect(() => {
        if (date.getFullYear() === today.getFullYear() && date.getMonth() == today.getMonth()) {
            setActiveDay(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
        }
    }, [props.date]);

    // This function creates empty dates at the beginning of the month starting Sunday
    const addEmptyDays = (option) => {
        const listOfDays = [];
        const numberOfDays = option === 'start' ? firstMonthDay : 6 - lastMonthDay;
        for (let i = 0; i < numberOfDays; i++) {
            listOfDays.push(
                <TouchableOpacity
                    style={styles.day}
                    onPress={() => { console.log('hi') }}>
                    <Text>null</Text>
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
                    style={(activeDay === day.join('-')) ? styles.activeDay : styles.day}
                    onPress={() => {
                        setActiveDay(day.join('-'));
                        console.log('active day', activeDay)
                        console.log('day', day)
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
                <View>
                    <Text style={styles.centerText}>{months[date.getMonth()]}</Text>
                    <Text style={styles.centerText}>{date.getFullYear()}</Text>
                </View>
                <TouchableOpacity
                    style={styles.monthControl}
                    onPress={() => { changeMonth('next') }}>
                    <Text style={styles.monthControl.text}>&#8250;</Text>
                </TouchableOpacity>
            </View>

            {/* This section shows the title of weekdays */}
            <View style={styles.weekdays}>
                {days.map(day => {
                    return (
                        <View style={{ ...styles.day, borderWidth: 0 }}>
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
        flex: 1,
        borderWidth: 4,
        backgroundColor: "#fff",
        position: 'absolute',
        top: 120,
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
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5
    },
    days: {
        borderWidth: 2,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    day: {
        backgroundColor: 'azure',
        borderWidth: 1,
        height: 25,
        width: '14.28%',
        alignItems: 'center'
    },
    activeDay: {
        backgroundColor: 'green',
        borderWidth: 1,
        height: 25,
        width: '14.28%',
        alignItems: 'center'
    },
    centerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center'
    },
    monthControl: {
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
        justifyContent: 'center',
        text: {
            fontSize: 22
        }
    }
});


export default Calendar