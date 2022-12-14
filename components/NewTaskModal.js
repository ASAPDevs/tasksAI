import { useState, useEffect } from "react";
import {
    Text,
    Button,
    Pressable,
    Input,
    Modal,
    FormControl,
} from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";


const NewTaskModal = ({ newTask, openNewTask, setTasks, addTask }) => {
    const [startTime, updateStartTime] = useState("");
    const [endTime, updateEndTime] = useState("");
    const [taskTitle, updateTaskTitle] = useState("");
    const [taskDescription, updateTaskDescription] = useState("");

    // const addTask = () => {
    //   let newTask = {
    //     title: taskTitle,
    //     description: taskDescription,
    //     startTime: startTime,
    //     endTime: endTime,
    //   };
    //   setTasks((task) => [...task, newTask]);
    //   openNewTask(false);
    // };


    useEffect(() => {
        console.log("START TIME: " + typeof startTime)
        console.log("START TIME: " + typeof endTime)
    }, [startTime, endTime])

    return (
        <Modal isOpen={newTask} onClose={() => openNewTask(false)} size="lg">
        <Modal.Content
            maxWidth="400"
            height="400"
            display="flex"
            flexDirection="column"
            alignItems="center"
            safeAreaTop={true}
        >
            <Modal.CloseButton />
            <Modal.Body>
            <FormControl>
                <FormControl.Label>Task Title:</FormControl.Label>
                <Input
                value={taskTitle}
                onChangeText={(text) => updateTaskTitle(text)}
                placeholder="Title"
                minWidth={"100%"}
                />
            </FormControl>
            <FormControl>
                <FormControl.Label>Task Description:</FormControl.Label>
                <Input
                value={taskDescription}
                onChangeText={(text) => updateTaskDescription(text)}
                placeholder="Description"
                minWidth={"100%"}
                />
            </FormControl>
            <StartTimeInput
                startTime={startTime}
                updateStartTime={updateStartTime}
            />
            <EndTimeInput endTime={endTime} updateEndTime={updateEndTime} />
            <Button
                onPress={() =>
                addTask(taskTitle, taskDescription, startTime, endTime)
                }
                marginTop={5}
            >
                <Text>Add Task</Text>
            </Button>
            </Modal.Body>
        </Modal.Content>
        </Modal>
    );
};

const StartTimeInput = ({ startTime, updateStartTime }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleSetStartTime = (date) => {
        updateStartTime(
        date.getTime()
        );
        setDatePickerVisibility(false);
    };

    return (
        <FormControl>
        <FormControl.Label>Start Time:</FormControl.Label>
        <Pressable>
            <Input
            isReadOnly
            value={new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            // onChange={(e) => setStartTime(e.target.value.toLocaleString())}
            minWidth={"100%"}
            InputRightElement={
                <Button onPress={() => setDatePickerVisibility(true)} size="sm">
                Pick Time
                </Button>
            }
            />
        </Pressable>
        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            onConfirm={handleSetStartTime}
            onCancel={() => setDatePickerVisibility(false)}
            is24Hour={false}
        />
        </FormControl>
    );
};

const EndTimeInput = ({ endTime, updateEndTime }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleSetEndTime = (date) => {
        updateEndTime(
        date.getTime()
        );
        setDatePickerVisibility(false);
    };

    return (
        <FormControl>
        <FormControl.Label>End Time:</FormControl.Label>
        <Pressable>
            <Input
            isReadOnly
            value={new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            // onChange={(e) => setStartTime(e.target.value.toLocaleString())}
            minWidth={"100%"}
            InputRightElement={
                <Button onPress={() => setDatePickerVisibility(true)} size="sm">
                Pick Time
                </Button>
            }
            />
        </Pressable>
        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            onConfirm={handleSetEndTime}
            onCancel={() => setDatePickerVisibility(false)}
            is24Hour={false}
        />
        </FormControl>
    );
};

export default NewTaskModal;