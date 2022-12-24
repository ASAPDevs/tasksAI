export const getTimeOfDay = (startTime) => {
  let time_of_day;
  const timeOfDayHour = new Date(Number(startTime)).getHours();
  if (timeOfDayHour < 7) {
    // dawn
    time_of_day = 1;
  } else if (timeOfDayHour >= 7 && timeOfDayHour < 12) {
    // morning
    time_of_day = 2;
  } else if (timeOfDayHour >= 12 && timeOfDayHour <= 18) {
    // afternoon
    time_of_day = 3;
  } else {
    // evening
    time_of_day = 4;
  }
  return time_of_day;
}

  // this function takes a user selected date and time,
// then it returns the correct time in miliseconds
export const convertDate = (selectedDate, selectedTime) => {
  const tempDate = new Date(selectedDate);
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();
  const day = tempDate.getDate();
  const hourAndMinutes = selectedTime.slice(0, selectedTime.indexOf(' ')).split(':');
  const minutes = Number(hourAndMinutes[1]);
  let hour = Number(hourAndMinutes[0]);

  if (selectedTime.includes('PM')) {
    if (hour === 12) {
      hour = 12;
    } else {
      hour += 12;
    }
    const convertedTime = new Date(year, month, day, hour, minutes).getTime();
    return convertedTime;
  } else {
    if (hour === 12) {
      hour = 0;
    }
    const convertedTime = new Date(year, month, day, hour, minutes).getTime();
    return convertedTime;
  }
}

export const displayTime = (milisec) => {
  const time = new Date(Number(milisec));
  let hours = time.getHours();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours === 12) {
    return `${12}:${minutes} PM`;
  } else if (hours === 0) {
    return `${12}:${minutes} AM`;
  } else if (hours > 12) {
    return `${hours % 12}:${minutes} PM`;
  } else {
    return `${hours}:${minutes} AM`;
  }
}