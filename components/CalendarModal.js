import { useCallback, useEffect, useState } from "react";
import {
    Text,
    Button,
    Pressable,
    Input,
    Modal,
    FormControl,
    Icon,
} from "native-base";
import { StyleSheet, Animated, View } from 'react-native';
import Calendar from "./Calendar";

function CalendarModal() {

    return (
        <Modal>
            <Calendar />
        </Modal>
    );
}

export default CalendarModal;