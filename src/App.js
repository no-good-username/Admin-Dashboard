// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from 'expo-secure-store';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/AuthNavigator';
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AlertProvider } from "./context/AlertContext";
// Create a secure token cache
const tokenCacheWithSecureStore = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const NotificationButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("NotificationPanel")}
    style={{ marginRight: 10 }}
  >
    <Icon name="notifications-outline" size={24} color="#333" />
  </TouchableOpacity>
);

// Get Clerk publishable key from environment variables
const publishableKey = "pk_test_YmFsYW5jZWQtYmxvd2Zpc2gtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA";

const App = () => {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCacheWithSecureStore}
    >
      <AuthProvider>
        <SafeAreaProvider>
          <AlertProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AlertProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </ClerkProvider>
  );
};

export default App;
