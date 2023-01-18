import React, { useState} from "react";
import { View, Text, Button, Modal, Select, Icon } from "native-base";
import { Entypo } from '@expo/vector-icons';

const PushComponent = ({ pushTaskHandler, pushTaskModal, openPushTaskModal }) => {
    const [selectedValue, updateSelectedValue] = useState(1);

    return (
      <Modal isOpen={pushTaskModal} onClose={() => openPushTaskModal(false)} >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header fontFamily="FamiljenGrotesk" alignSelf="center" >Push Task</Modal.Header>
          <Modal.Body display="flex" flexDirection="row" justifyContent="space-between">
            <View width="100%" display="flex" alignItems="center" >
              <Select width="50%" defaultValue={1} onValueChange={(itemValue) => updateSelectedValue(itemValue)} >
                <Select.Item label="1 hr" value={1} />
                <Select.Item label="2 hr" value={2} />
                <Select.Item label="3 hr" value={3} />
              </Select>
              <Button height={12} justifyContent="center" alignContent="center" alignItems="center" bgColor="#FAA946" variant="solid" width="50%" marginTop={3} flexDirection="row" onPress={() => pushTaskHandler(selectedValue)}>
                <View alignItems="center">
                  <Text textAlign="center" fontFamily="FamiljenGrotesk">Push</Text>
                  <Icon as={Entypo} name="arrow-right" color="grey" size={5}/>
                </View>
              </Button>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
  }

export default PushComponent