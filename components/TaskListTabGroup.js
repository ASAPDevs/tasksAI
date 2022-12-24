import React from "react";
import { Icon, IconButton, Button } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TaskListTabGroup = ({ currentTab, switchTab }) => {

  return (
    <Button.Group
      colorScheme="grey"
      variant="link"
      isAttached
      borderless
      size="sm"
      style={{ top: 4, position: "absolute", right: 50 }}
    >
      <IconButton
        onPress={() => switchTab("inprogress")}
        borderless
        icon={
          <Icon
            color={currentTab === "inprogress" ? "orange.400" : "grey"}
            as={MaterialCommunityIcons}
            name="progress-clock"
            size={5}
          />
        }
      />

      <IconButton
      borderless
        onPress={() => switchTab("completed")}
        icon={
          <Icon
            color={currentTab === "completed" ? "orange.400" : "grey"}
            as={MaterialCommunityIcons}
            name="progress-check"
            size={5}
          />
        }
      />
      <Button
        borderless
        onPress={() => switchTab("all")}
        _text={{
          color: `${currentTab == "all" ? "orange.400" : "grey"}`,
        }}
        fontFamily="FamiljenGrotesk"
      >
        All
      </Button>
    </Button.Group>
  );
};

export default TaskListTabGroup;
