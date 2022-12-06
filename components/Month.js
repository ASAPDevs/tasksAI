import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';

function Calendar() {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const [activeDay, setActiveDay] = useState(today.getDate());
    const firstMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstMonthDay = firstMonthDate.getDay(); // 0 based

    // This section creates empty dates at the beginning of the month starting Sunday
    const addEmptyDays = () => {
        const listOfDays = [];
        for (let i = 0; i < firstMonthDay; i++) {
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

    // This section creates this month's dates
    const addActualDays = () => {
        const listOfDays = [];
        for (let i = 1; i <= lastMonthDate.getDate(); i++) {
            listOfDays.push(
                <TouchableOpacity
                    style={(i !== activeDay) ? styles.day : styles.activeDay}
                    onPress={() => { setActiveDay(i) }}>
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
                    onPress={() => { console.log('last month') }}>
                    <Text style={styles.monthControl.text}>&#8249;</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.centerText}>{months[today.getMonth()]}</Text>
                    <Text style={styles.centerText}>{today.getFullYear()}</Text>
                </View>
                <TouchableOpacity
                    style={styles.monthControl}
                    onPress={() => { console.log('next month') }}>
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