import React, {useEffect, useState} from 'react';
import { Circle, Text, Icon, Pressable} from 'native-base';
import { TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const CreateTaskCircle = ({ radius, borderWidth, color, text, icon, onPress }) => {
  const [animatedValue] = useState(new Animated.Value(1));

  const onPressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
      friction: 7,
      tension: 50,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 7,
      tension: 30,
      useNativeDriver: true
    }).start();
  };

  const buttonStyle = {
    transform: [{ scale: animatedValue }]
  };

  


  return (
    <TouchableOpacity on onPress={() => {
      onPress()
    }}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    style={buttonStyle}
    >
      <Circle
      style={{
        width: radius * 2,
        height: radius * 2,
        borderWidth: 1,
        borderColor: "#E8EEF7",
        backgroundColor: "#FAA946",
        alignItems: 'center',
        bottom: -50,
        right: 65,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      }}
      > 
        <Icon as={MaterialCommunityIcons} color="white" marginLeft={1} name="note-plus-outline" size={8} />
      </Circle>
    </TouchableOpacity>
  );
};


export default CreateTaskCircle;
