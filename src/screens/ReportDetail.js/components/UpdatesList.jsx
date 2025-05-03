import React from "react";
import { View, FlatList } from "react-native";
import UpdateItem from "./UpdateItem";
import styles from "../styles";

const UpdatesList = ({ updates }) => {
  const formattedUpdates = updates.length > 0
    ? updates.map((update, index) => {
        // Handle string updates
        if (typeof update === 'string') {
          return {
            id: `mapped-string-update-${index}-${Date.now()}`,
            text: update
          };
        }
        // Handle object updates
        return {
          ...update,
          id: update.id || `mapped-update-${index}-${Date.now()}`
        };
      })
    : [{ id: "empty-updates-section", isEmpty: true }];
  
  return (
    <FlatList
      data={formattedUpdates}
      renderItem={({ item }) => <UpdateItem item={item} />}
      keyExtractor={item => item.id}
    />
  );
};

export default UpdatesList;