import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    Icon,
} from "native-base";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons'; 


const UnderTaskButton = ({item, rowMap, handleDeleteTask}) => {
    const [deleteConfirmation, toggleDeleteConfirmation] = useState(false);
  

      return (
        <View style={styles.deleteTaskContainer}>
          <View style={{backgroundColor: '#FAA946', height: '100%', minWidth: '55%', maxWidth:'55%'}}>
            <Icon
                as={AntDesign}
                name="checkcircle"
                color="white"
                size={8}
              />
          </View>
          {!deleteConfirmation ? (
          <Pressable style={{display: 'flex', flex: '1', minWidth: '50%', maxWidth:'50%', height:'100%', backgroundColor: 'red', width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} onPress={() => {
            toggleDeleteConfirmation(true)
          }}>
            <Text style={{color: 'white'}}>Delete </Text>
            <Icon
              as={MaterialCommunityIcons}
              name="delete"
              color="white"
              size={"8"}
              marginRight={12}
            />
          </Pressable>) :
          <Pressable style={{display: 'flex', minWidth: '50%', maxWidth:'50%', height:'100%', backgroundColor: 'red', width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}onPress={() => {
            handleDeleteTask(item.id)
            rowMap[item.key].closeRow()
            toggleDeleteConfirmation(false)
          }}>
            <Text style={{color: 'white'}}>Are you sure? </Text>
            <Icon
              as={Entypo}
              name="circle-with-cross"
              color="white"
              size={"8"}
              marginRight={10}
            />
          </Pressable>
            }
        </View>
      );
  }

  const styles = StyleSheet.create({
   
    deleteTaskContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: 'center',
      justifyContent: "center",
      height: 90,
      width: '95%',
      zIndex: 9,
      shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
      // backgroundColor: 'red',
    },
  });

export default UnderTaskButton;