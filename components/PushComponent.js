import React, { useState} from "react";
import { View, Text, Button, Modal, Select } from "native-base";

const PushComponent = ({ pushTaskHandler, pushTaskModal, openPushTaskModal }) => {
    const [selectedValue, updateSelectedValue] = useState(0);

    return (
      <Modal isOpen={pushTaskModal} onClose={() => openPushTaskModal(false)} >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header alignSelf="center" >Push Task</Modal.Header>
          <Modal.Body display="flex" flexDirection="row" justifyContent="space-between">
            <View width="100%" display="flex" alignItems="center" >
              <Text>New Time</Text>
              <Select width="50%" onValueChange={(itemValue) => updateSelectedValue(itemValue)} >
                <Select.Item label="1 hr" value={1} />
                <Select.Item label="2 hr" value={2} />
                <Select.Item label="3 hr" value={3} />
              </Select>
              <Button onPress={() => pushTaskHandler(selectedValue)} >Push {selectedValue} hours</Button>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
  }

export default PushComponent