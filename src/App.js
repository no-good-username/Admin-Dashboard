// App.js
import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure to install this package

// Import your screens
import Dashboard from "./screens/Dashboard/Dashboard";
import MapView from "./screens/MapView/MapView";
import IssueManagement from "./screens/IssueManagement/IssueManagement";
import Reports from "./screens/Reports/Reports";
import Analytics from "./screens/Analytics/Analytics";
import NotificationPanel from "./screens/NotificationPanel/NotificationPanel";
import ReportDetail from "./screens/ReportDetail.js/ReportDetail";

const Stack = createNativeStackNavigator();

const NotificationButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("NotificationPanel")}
    style={{ marginRight: 10 }}
  >
    <Icon name="notifications-outline" size={24} color="#333" />
  </TouchableOpacity>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#333",
            // Add notification button to header right for all screens
            headerRight: () => <NotificationButton navigation={navigation} />,
          })}
        >
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ title: "Streetlight Repair Monitoring" }}
          />
          <Stack.Screen
            name="MapView"
            component={MapView}
            options={{ title: "Map View" }}
          />
          <Stack.Screen
            name="IssueManagement"
            component={IssueManagement}
            options={{ title: "Issue Management" }}
          />
          <Stack.Screen
            name="Reports"
            component={Reports}
            options={{ title: "Generate Report" }}
          />
          <Stack.Screen
            name="Analytics"
            component={Analytics}
            options={{ title: "Analytics" }}
          />
          <Stack.Screen
            name="NotificationPanel"
            component={NotificationPanel}
            options={{ title: "Notification Panel" }}
          />
          <Stack.Screen name="ReportDetail" component={ReportDetail}   options={{ title: "Report Details" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
