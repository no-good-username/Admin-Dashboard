import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthContext } from '../context/AuthContext';

// Auth screens
import PreHome from '../screens/Auth/PreHome';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';

// App screens (imported from App.js stack)
import Dashboard from '../screens/Dashboard/Dashboard';
import MapView from '../screens/MapView/MapView';
import IssueManagement from '../screens/IssueManagement/IssueManagement';
import Reports from '../screens/Reports/Reports';
import Analytics from '../screens/Analytics/Analytics';
import NotificationPanel from '../screens/NotificationPanel/NotificationPanel';
import ReportDetail from '../screens/ReportDetail.js/ReportDetail';
import Profile from '../screens/Profile/Profile';
// Create stacks for authenticated and non-authenticated flows
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

// Auth navigator for non-authenticated users
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="PreHome"
    >
      <AuthStack.Screen name="PreHome" component={PreHome} />
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

// App navigator for authenticated users
const AppNavigator = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
      })}
    >
      <AppStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: "Streetlight Repair Monitoring" }}
      />
      <AppStack.Screen
        name="MapView"
        component={MapView}
        options={{ title: "Map View" }}
      />
      <AppStack.Screen
        name="IssueManagement"
        component={IssueManagement}
        options={{ title: "Issue Management" }}
      />
      <AppStack.Screen
        name="Reports"
        component={Reports}
        options={{ title: "Generate Report" }}
      />
      <AppStack.Screen
        name="Analytics"
        component={Analytics}
        options={{ title: "Analytics" }}
      />
      <AppStack.Screen
        name="NotificationPanel"
        component={NotificationPanel}
        options={{ title: "Notification Panel" }}
      />
      <AppStack.Screen 
        name="ReportDetail" 
        component={ReportDetail}   
        options={{ title: "Report Details" }} 
      />
      <AppStack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
      />
    </AppStack.Navigator>
  );
};

// Root navigator that decides which stack to show based on auth state
const RootNavigator = () => {
  const { isSignedIn, loading } = useAuthContext();

  console.log("RootNavigator: isSignedIn:", isSignedIn, "loading:", loading);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return  isSignedIn ? <AppNavigator /> :<AuthNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});

export default RootNavigator;