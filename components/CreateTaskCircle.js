import React, { useState} from 'react';
import { Icon, View } from 'native-base';
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
   <View style={{display: 'flex', justifyContent: 'center', flex: 1, alignItems: 'center', position: 'absolute', borderColor: 'blue', bottom: 0, right: 0, width: '100%'}}>
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
         alignItems: 'center',
         justifyContent: 'center',
         transform: [{ scale: animatedValue }]
      }}>
        <Icon as={MaterialIcons} color="white" marginLeft={0} name="library-add" size={8} />
      </Animated.View>
    </TouchableOpacity>
   </View>
  );
};


export default CreateTaskCircle;
