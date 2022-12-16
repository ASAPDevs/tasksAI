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
import {StyleSheet, Animated, View} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const NewTaskModal = ({ newTask, openNewTask, setTasks, addTask }) => {
    const [startTime, updateStartTime] = useState("");
    const [endTime, updateEndTime] = useState("");
    const [taskTitle, updateTaskTitle] = useState("");
    const [taskDescription, updateTaskDescription] = useState("");
    const [invalidSubmission, toggleInvalidSubmission] = useState(false);



    //handles main functionality of onPress
    const onPress = () => {
        if (taskTitle == '') toggleInvalidSubmission(true)
        else addTask(taskTitle, taskDescription, startTime, endTime)
    }

    const CreateButton = ({onPress}) => {
        const [animatedValue, setAnimatedValue] = useState(new Animated.Value(1));
        

        const onPressIn = () => {
          Animated.spring(animatedValue, {
            toValue: 0.98,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }).start();
        };
    
        const onPressOut = () => {
          Animated.spring(animatedValue, {
            toValue: 1,
            friction: 7,
            tension: 30,
            useNativeDriver: true,
          }).start();
        };

        
    
        const buttonStyle = {
          transform: [{ scale: animatedValue }],
        };
    
        return (
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
          >
            <Animated.View
              style={{
                ...buttonStyle,
                marginTop: 15,
                alignSelf: 'center',
                width: '30%',
                height: 50,
                borderRadius: 10,
                backgroundColor: '#FAA946',
                flexDirection: 'column',
                display: 'flex',
                borderColor: '#E8EEF7',
                borderWidth: 3,
                justifyContent: 'center',
              }}
            >
              <Icon marginTop={0.5} alignSelf="center" as={FontAwesome} name="plus" size={3} color="#E8EEF7" />
            </Animated.View>
          </Pressable>
        );
      };


    
    useEffect(() => {
        if (invalidSubmission) setTimeout(() => toggleInvalidSubmission(false), 5000)
    }, [invalidSubmission])



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
                    invalidOutlineColor="red.500"
                    isInvalid={invalidSubmission ? true : false}
                    borderColor="black"
                    value={taskTitle}
                    focusOutlineColor="black"
                    _focus={{
                        bgColor: `${invalidSubmission ? "white" : 'rgb(243,228,197)'}`
                    }}
                    onChangeText={(text) => updateTaskTitle(text)}
                    placeholder={invalidSubmission ? "A title is needed for a new task!" : "Title"}
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
                <CreateButton onPress={onPress} />
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