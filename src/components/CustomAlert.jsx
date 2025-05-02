import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * CustomAlert - A modern, animated alert component
 * 
 * @param {boolean} visible - Controls visibility of the alert
 * @param {string} type - Type of alert: 'success', 'error', 'warning', 'info'
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {array} buttons - Array of button objects: [{text: 'Cancel', style: 'cancel', onPress: () => {}}, ...]
 * @param {function} onDismiss - Called when alert is dismissed
 */
const CustomAlert = ({ 
  visible, 
  type = 'info', 
  title, 
  message, 
  buttons = [], 
  onDismiss 
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const getIconDetails = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: '#34C759' };
      case 'error':
        return { name: 'times-circle', color: '#FF3B30' };
      case 'warning':
        return { name: 'exclamation-triangle', color: '#FF9500' };
      case 'info':
      default:
        return { name: 'info-circle', color: '#007AFF' };
    }
  };

  const { name, color } = getIconDetails();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.alertContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name={name} size={32} color={color} />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => {
              // Determine button style
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';
              const isPrimary = !isDestructive && !isCancel;
              
              let buttonStyle = styles.defaultButton;
              let textStyle = styles.defaultButtonText;
              
              if (isPrimary) {
                buttonStyle = styles.primaryButton;
                textStyle = styles.primaryButtonText;
              } else if (isDestructive) {
                buttonStyle = styles.destructiveButton;
                textStyle = styles.destructiveButtonText;
              } else if (isCancel) {
                buttonStyle = styles.cancelButton;
                textStyle = styles.cancelButtonText;
              }
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    buttonStyle,
                    index > 0 && styles.buttonMargin
                  ]}
                  onPress={() => {
                    if (button.onPress) button.onPress();
                    onDismiss();
                  }}
                >
                  <Text style={textStyle}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width - 48,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  defaultButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  defaultButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonMargin: {
    marginLeft: 12,
  }
});

export default CustomAlert;