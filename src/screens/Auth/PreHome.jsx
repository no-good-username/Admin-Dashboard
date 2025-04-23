import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignOutButton } from '../../components/signOutButton';

const PreHome = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="lightbulb" size={60} color="#000000" />
          <Text style={styles.logoText}>STREETLIGHT</Text>
          <Text style={styles.logoSubtitle}>Administrator Panel</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome to the Admin Dashboard</Text>
          <Text style={styles.description}>
            Efficiently monitor and manage city streetlights. Track issues, generate reports,
            and ensure timely maintenance.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Streetlight Monitor System</Text>
          <Text style={styles.footerText}>v1.0.0</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 32,
    marginHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  signInButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
});

export default PreHome;