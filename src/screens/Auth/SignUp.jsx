import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

const SignUp = ({ navigation }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  
  // Form stages
  const [stage, setStage] = useState(1); // 1: Personal, 2: Location, 3: Verification
  
  // Personal information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Organizational information
  const [division, setDivision] = useState('');
  const [subDivision, setSubDivision] = useState('');
  const [area, setArea] = useState('');
  
  // Divisions data (replace with your actual data)
  const divisions = ['Division 1', 'Division 2', 'Division 3'];
  const subDivisionOptions = {
    'Division 1': ['Sub 1A', 'Sub 1B', 'Sub 1C'],
    'Division 2': ['Sub 2A', 'Sub 2B', 'Sub 2C'],
    'Division 3': ['Sub 3A', 'Sub 3B', 'Sub 3C'],
  };
  const areaOptions = {
    'Sub 1A': ['Area 1A-1', 'Area 1A-2'],
    'Sub 1B': ['Area 1B-1', 'Area 1B-2'],
    'Sub 1C': ['Area 1C-1', 'Area 1C-2'],
    'Sub 2A': ['Area 2A-1', 'Area 2A-2'],
    'Sub 2B': ['Area 2B-1', 'Area 2B-2'],
    'Sub 2C': ['Area 2C-1', 'Area 2C-2'],
    'Sub 3A': ['Area 3A-1', 'Area 3A-2'],
    'Sub 3B': ['Area 3B-1', 'Area 3B-2'],
    'Sub 3C': ['Area 3C-1', 'Area 3C-2'],
  };
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset subdivision and area when division changes
  useEffect(() => {
    if (division) {
      setSubDivision('');
      setArea('');
    }
  }, [division]);

  // Reset area when subdivision changes
  useEffect(() => {
    if (subDivision) {
      setArea('');
    }
  }, [subDivision]);

  // Move to next stage
  const handleNextStage = () => {
    if (stage === 1) {
      // Validate first stage
      if (!firstName || !lastName || !emailAddress || !password || !phoneNumber) {
        setError('All fields are required');
        return;
      }
      setError('');
      setStage(2);
    } else if (stage === 2) {
      // Validate second stage
      if (!division || !subDivision || !area) {
        setError('All fields are required');
        return;
      }
      setError('');
      handleSignUp();
    }
  };

  // Go back to previous stage
  const handlePrevStage = () => {
    if (stage > 1) {
      setStage(stage - 1);
      setError('');
    }
  };

  // Start the sign up process
  const handleSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
        unsafeMetadata: {
          division,
          subDivision,
          area,
          phoneNumber
        }
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Change UI to show verification form
      setPendingVerification(true);
    } catch (err) {
      console.error('Error during sign up:', err);
      setError(err.errors?.[0]?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Verify email with the code
  const onVerifyPress = async () => {
    if (!code) {
      setError('Verification code is required');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error('Error during verification:', err);
      setError(err.errors?.[0]?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  // Render stage 1 - Personal information
  const renderStage1 = () => (
    <>
      <Text style={styles.headerText}>Create Account</Text>
      <Text style={styles.subHeaderText}>Personal Information</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            autoCapitalize="words"
            textContentType="givenName"
          />
        </View>
        
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            autoCapitalize="words"
            textContentType="familyName"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
        />
      </View>

      <TouchableOpacity
        style={[styles.signUpButton, loading ? styles.disabledButton : null]}
        onPress={handleNextStage}
        disabled={loading || !isLoaded}
      >
        <Text style={styles.signUpButtonText}>Next</Text>
      </TouchableOpacity>
    </>
  );

  // Render stage 2 - Location information
  const renderStage2 = () => (
    <>
      <Text style={styles.headerText}>Create Account</Text>
      <Text style={styles.subHeaderText}>Organizational Information</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Division</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={division}
            onValueChange={(itemValue) => setDivision(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Division" value="" />
            {divisions.map((div) => (
              <Picker.Item key={div} label={div} value={div} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Sub Division</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={subDivision}
            onValueChange={(itemValue) => setSubDivision(itemValue)}
            style={styles.picker}
            enabled={!!division}
          >
            <Picker.Item label="Select Sub Division" value="" />
            {division && subDivisionOptions[division]?.map((subdiv) => (
              <Picker.Item key={subdiv} label={subdiv} value={subdiv} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Area</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={area}
            onValueChange={(itemValue) => setArea(itemValue)}
            style={styles.picker}
            enabled={!!subDivision}
          >
            <Picker.Item label="Select Area" value="" />
            {subDivision && areaOptions[subDivision]?.map((areaOption) => (
              <Picker.Item key={areaOption} label={areaOption} value={areaOption} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={handlePrevStage}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.signUpButton, loading ? styles.disabledButton : null]}
          onPress={handleNextStage}
          disabled={loading || !isLoaded}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  // Render verification stage
  const renderVerificationStage = () => (
    <>
      <Text style={styles.headerText}>Verify Your Email</Text>
      <Text style={styles.subHeaderText}>
        We've sent a verification code to {emailAddress}
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Verification Code</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Enter verification code"
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.signUpButton, loading ? styles.disabledButton : null]}
        onPress={onVerifyPress}
        disabled={loading || !isLoaded}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.signUpButtonText}>Verify Email</Text>
        )}
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Streetlight Monitor</Text>
            <Text style={styles.logoSubtext}>Admin Dashboard</Text>
          </View>

          <View style={styles.formContainer}>
            {!pendingVerification ? (
              <>
                {stage === 1 && renderStage1()}
                {stage === 2 && renderStage2()}
              </>
            ) : (
              renderVerificationStage()
            )}

            {!pendingVerification && (
              <TouchableOpacity
                style={styles.signInContainer}
                onPress={() => navigation.navigate('SignIn')}
                disabled={loading}
              >
                <Text style={styles.signInText}>
                  Already have an account? <Text style={styles.signInLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  logoSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
  },
  backButton: {
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#4B5563',
  },
  signInLink: {
    color: '#000',
    fontWeight: '600',
  },
});

export default SignUp;