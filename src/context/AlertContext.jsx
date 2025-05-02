import React, { createContext, useState, useContext } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

/**
 * AlertProvider - Context provider for managing alerts
 * 
 * @param {object} children - React children components
 */
export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = ({ type, title, message, buttons }) => {
    setAlertConfig({
      visible: true,
      type: type || 'info',
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
    </AlertContext.Provider>
  );
};

/**
 * useAlert - Hook for using the alert system
 * Example: 
 * const { showAlert } = useAlert();
 * showAlert({
 *   type: 'success',
 *   title: 'Success',
 *   message: 'Operation completed successfully',
 *   buttons: [{ text: 'OK' }]
 * });
 */
export const useAlert = () => useContext(AlertContext);

export default AlertContext;