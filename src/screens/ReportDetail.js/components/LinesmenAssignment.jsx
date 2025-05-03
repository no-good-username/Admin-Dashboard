import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

const LinesmenAssignment = ({
  selectedLinesmen,
  toggleLinesman,
  onShowModal,
  assignTask,
  isLoading
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.selectLinesmenButton}
        onPress={onShowModal}
      >
        <Text style={styles.selectLinesmenButtonText}>Select Linesmen</Text>
        <FontAwesome name="user-plus" size={18} color="#000000" />
      </TouchableOpacity>

      {/* Display selected linesmen if any */}
      {selectedLinesmen.length > 0 && (
        <View style={styles.selectedLinesmenContainer}>
          {selectedLinesmen.map((item) => (
            <View key={item.value} style={styles.selectedLinesman}>
              <FontAwesome name="user" size={14} color="#000000" style={styles.userIcon} />
              <Text style={styles.selectedLinesmanText}>{item.label}</Text>
              <TouchableOpacity onPress={() => toggleLinesman(item)}>
                <FontAwesome name="times-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      {/* Show message when no linesmen are selected */}
      {selectedLinesmen.length === 0 && (
        <View style={styles.noLinesmenContainer}>
          <Text style={styles.noLinesmenText}>No linesmen assigned yet</Text>
        </View>
      )}

      {/* Assign Task Button - always visible */}
      <TouchableOpacity
        style={[
          styles.assignTaskButton, 
          isLoading && styles.disabledButton,
          selectedLinesmen.length === 0 && styles.warningButton
        ]}
        onPress={assignTask}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Text style={styles.assignTaskButtonText}>
              {selectedLinesmen.length === 0 
                ? "Select Linesmen to Assign Task" 
                : "Assign Task"
              }
            </Text>
            <FontAwesome 
              name={selectedLinesmen.length === 0 ? "exclamation-circle" : "tasks"} 
              size={16} 
              color="white" 
              style={styles.assignTaskIcon} 
            />
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

export default LinesmenAssignment;