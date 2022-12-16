import { useState } from "react";
import {
    Text,
    Button,
    Pressable,
    Input,
    View,
    Modal,
    FormControl,
    Icon
} from "native-base";
import {StyleSheet} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const NewTaskModal = ({ newTask, openNewTask, setTasks, addTask }) => {
    const [startTime, updateStartTime] = useState("");
    const [endTime, updateEndTime] = useState("");
    const [taskTitle, updateTaskTitle] = useState("");
    const [taskDescription, updateTaskDescription] = useState("");

    return (
        <Modal top={5} isOpen={newTask} onClose={() => openNewTask(false)} size="xl">
            <Modal.Header
            borderTopLeftRadius="5%"
            borderTopRadius="5%"
            width="375"
            bgColor="#F0F0F0"
            borderBottomRadius={0}
            borderColor="#ADB7B8"
            borderWidth={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontFamily="FamiljenBold"
            >
            New Task
            <Modal.CloseButton />
            </Modal.Header>
            
            <Modal.Content
                width="375"
                height="400"
                display="flex"
                flexDirection="column"
                alignItems="center"
                borderColor="#ADB7B8"
                borderWidth={1}
                borderTopWidth={0}
                paddingTop={5}
                bgColor="#F0F0F0"
                borderTopRadius={0}
                borderBottomRadius="5%"
            >
                
                <Modal.Body>
                <FormControl style={styles.taskNameContainer}>
                    <FormControl.Label style={{fontFamily: 'FamiljenGrotesk'}}>Title:</FormControl.Label>
                    <Input
                    borderColor="black"
                    value={taskTitle}
                    focusOutlineColor="black"
                    _focus={{
                        bgColor: 'rgb(243,228,197)'
                    }}
                    onChangeText={(text) => updateTaskTitle(text)}
                    placeholder="Title"
                    style={{fontFamily: 'FamiljenGrotesk'}}
                    minWidth={"100%"}
                    />
                </FormControl>
                <FormControl style={styles.taskDescriptionContainer}>
                    <FormControl.Label style={{fontFamily: 'FamiljenGrotesk'}}>Description:</FormControl.Label>
                    <View style={{height: '100%'}}>
                        <Input
                        multiline={true}
                        height={'75%'}
                        maxHeight={'75%'}
                        borderColor="black"
                        _focus={{
                            bgColor: 'rgb(243,228,197)'
                        }}
                        focusOutlineColor="black"
                        value={taskDescription}
                        onChangeText={(text) => updateTaskDescription(text)}
                        placeholder="Description"
                        minWidth={"100%"}
                        style={{fontFamily: 'FamiljenGrotesk'}}
                        />
                    </View>
                </FormControl>
                <View style={styles.timeInputsContainer}>
                    <StartTimeInput startTime={startTime} updateStartTime={updateStartTime}/>
                    <EndTimeInput endTime={endTime} updateEndTime={updateEndTime} />
                </View>
                <Button
                    size="md"
                    alignSelf="center"
                    width="50%"
                    height="15.5%"
                    maxHeight="15.5%"
                    display="flex"
                    bgColor="#FAA946"
                    justifyContent="center"
                    flexDirection="column"
                    rightIcon={""}
                    borderColor="black"
                    borderWidth={1}
                    onPress={() =>
                    addTask(taskTitle, taskDescription, startTime, endTime)
                    }
                    marginTop={5}
                >
                    <Text style={{fontFamily: 'FamiljenBold', color: 'black'}}>CREATE</Text>
                    <Icon marginTop={0.5} alignSelf="center" as={FontAwesome} name="plus" size={3} color="black" />
                </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export const StartTimeInput = ({ startTime, updateStartTime }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleSetStartTime = (date) => {
        updateStartTime(
        date.getTime()
        );
        setDatePickerVisibility(false);
    };

    return (
        <FormControl style={styles.timeInputContainer}>
        <FormControl.Label style={styles.timeInputContainerLabel}>Start Time:</FormControl.Label>
        <View style={styles.timeInputWrapper}>
            <Input
            isReadOnly
            borderColor="black"
            style={styles.timeInput}
            value={typeof startTime == 'number' ? new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'None' }
            InputRightElement={
                <Button
                height="100%"
                borderRadius={0}
                borderColor="black"
                borderLeftWidth={1}
                bgColor="#FAA946" 
                onPress={() => setDatePickerVisibility(true)} size="sm">
                <Icon as={FontAwesome} name="clock-o" color="white" size={15} />
                </Button>
            }
            />
        </View>
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

export const EndTimeInput = ({ endTime, updateEndTime }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleSetEndTime = (date) => {
        updateEndTime(
        date.getTime()
        );
        setDatePickerVisibility(false);
    };

    return (
        <FormControl style={styles.timeInputContainer}>
        <FormControl.Label style={styles.timeInputContainerLabel}>End Time:</FormControl.Label>
        <View style={styles.timeInputWrapper}>
            <Input
            isReadOnly
            borderColor="black"
            style={styles.timeInput}
            value={typeof endTime == 'number' ? new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'None' }
            InputRightElement={
                <Button
                height="100%"
                borderRadius={0}
                borderLeftColor="black"
                borderLeftWidth={1}
                borderRightColor="#FAA946"
                borderRightWidth={1}
                bgColor="#FAA946"
                onPress={() => setDatePickerVisibility(true)} size="sm">
                    <Icon as={FontAwesome} name="clock-o" color="white" size={15} />
                </Button>
            }
            />
        </View>
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


const styles = StyleSheet.create({
    createTaskContainer: {
        borderColor: "black",
        borderWidth: 3
    },
    taskNameContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    taskDescriptionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "35%",
        maxHeight: "35%"
    },
    timeInputsContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        maxWidth: '100%', 
        justifyContent: 'space-between', 
        padding: 5,},
    timeInputContainer: {
         
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    timeInputContainerLabel: {
        fontFamily: 'FamiljenBold'
    },
    timeInputWrapper: {
        width: '100%',
        overflow: 'hidden',
        height: 40
    },
    timeInput: {
        fontFamily: 'FamiljenGrotesk', 
        height: '100%'},
    })

export default NewTaskModal;