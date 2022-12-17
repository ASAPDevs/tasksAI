import React, { useState} from 'react';
import { Icon } from 'native-base';
import { TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const CreateTaskCircle = ({ radius, onPress }) => {
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



  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => {
      onPress()
    }}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    accessibilityLabel={"Create A Task Button"}
    accessibilityRole="button"
    >
      <Animated.View style={{
         width: radius * 2,
         height: radius * 2,
         borderRadius: 50,
         borderWidth: 1,
         borderColor: "#E8EEF7",
         backgroundColor: "#FAA946",
         bottom: 30,
         left: 190,
         alignItems: 'center',
         justifyContent: 'center',
         position: 'relative',
         transform: [{ scale: animatedValue }]
      }}>
        <Icon as={MaterialIcons} color="white" marginLeft={0} name="library-add" size={8} />
      </Animated.View>
    </TouchableOpacity>
  );
};


export default CreateTaskCircle;
