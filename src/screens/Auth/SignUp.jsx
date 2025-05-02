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
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  
  // States for API data
  const [fetchedAreas, setFetchedAreas] = useState([]);
  const [divisionsData, setDivisionsData] = useState([]);
  const [subDivisionsData, setSubDivisionsData] = useState({});
  const [areasData, setAreasData] = useState({});
  const [areaIdsMap, setAreaIdsMap] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch areas data from the API
  const fetchAreasData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch('http://192.168.0.18:3001/admin/fetchArea');
      const result = await response.json();
      
      if (result.success) {
        // Store raw data
        setFetchedAreas(result.data);
        
        // Extract unique divisions
        const uniqueDivisions = Array.from(
          new Set(result.data.map(item => item.subdivision.division.name))
        );
        setDivisionsData(uniqueDivisions);
        
        // Group subdivisions by division
        const subDivsByDivision = {};
        uniqueDivisions.forEach(div => {
          const relevantAreas = result.data.filter(
            item => item.subdivision.division.name === div
          );
          const uniqueSubdivs = Array.from(
            new Set(relevantAreas.map(item => item.subdivision.name))
          );
          subDivsByDivision[div] = uniqueSubdivs;
        });
        setSubDivisionsData(subDivsByDivision);
        
        // Group areas by subdivision and create area ID map
        const areasBySubdiv = {};
        const idsMap = {};
        
        Object.keys(subDivsByDivision).forEach(div => {
          subDivsByDivision[div].forEach(subdiv => {
            const relevantAreas = result.data.filter(
              item => item.subdivision.name === subdiv
            );
            areasBySubdiv[subdiv] = relevantAreas.map(item => item.name);
            
            // Store area IDs by name for lookup
            relevantAreas.forEach(item => {
              idsMap[item.name] = item.id;
            });
          });
        });
        
        setAreasData(areasBySubdiv);
        setAreaIdsMap(idsMap);
      } else {
        setError('Failed to load area data');
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
      setError('Error loading location data. Please try again later.');
    } finally {
      setDataLoading(false);
    }
  };
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchAreasData();
  }, []);

  // Reset subdivision and area when division changes
  useEffect(() => {
    if (division) {
      setSubDivision('');
      setArea('');
      setSelectedAreaId(null);
    }
  }, [division]);

  // Reset area when subdivision changes
  useEffect(() => {
    if (subDivision) {
      setArea('');
      setSelectedAreaId(null);
    }
  }, [subDivision]);

  // Update selectedAreaId when area changes
  useEffect(() => {
    if (area) {
      setSelectedAreaId(areaIdsMap[area] || null);
    } else {
      setSelectedAreaId(null);
    }
  }, [area, areaIdsMap]);

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
      if (!division || !subDivision || !area || !selectedAreaId) {
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
      
      // Create user with Clerk
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
        unsafeMetadata: {
          division,
          subDivision,
          area,
          phoneNumber,
          selectedAreaId // Store areaId in metadata for later use
        }
      });
  
      // Send verification email through Clerk
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Change UI to show verification form
      setPendingVerification(true);
    } catch (err) {
      console.error('Error during sign up:', err);
      setError(err.errors?.[0]?.message || err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };
  
  // Verify email with the code and then register with backend
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
      
      // Now that email is verified, register with the backend
      const backendResponse = await fetch('https://streetlightfix-backend-1.onrender.com/Signup/Engineer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Data: {
            FName: firstName,
            LName: lastName,
            Email: emailAddress,
            Mobile: phoneNumber,
            Wid: selectedAreaId
          },
          roles: "JuniorEngineer" 
        })
      });
      console.log(firstName, lastName, emailAddress, phoneNumber, selectedAreaId);
      const backendResult = await backendResponse.json();
      console.log('Backend registration result:', backendResult);
      if (!backendResponse.ok) {
        throw new Error(backendResult.message || 'Failed to register with backend system');
      }
      
      // After successful backend registration, set active session
      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error('Error during verification or backend registration:', err);
      setError(err.errors?.[0]?.message || err.message || 'Failed to verify email or register with backend');
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

      {dataLoading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Division</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={division}
                onValueChange={(itemValue) => setDivision(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Division" value="" />
                {divisionsData.map((div) => (
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
                {division && subDivisionsData[division]?.map((subdiv) => (
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
                {subDivision && areasData[subDivision]?.map((areaOption) => (
                  <Picker.Item key={areaOption} label={areaOption} value={areaOption} />
                ))}
              </Picker>
            </View>
          </View>
          
          {selectedAreaId && (
            <Text style={styles.areaIdText}>Area ID: {selectedAreaId}</Text>
          )}
        </>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={handlePrevStage}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.signUpButton, (loading || dataLoading) ? styles.disabledButton : null]}
          onPress={handleNextStage}
          disabled={loading || !isLoaded || dataLoading}
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
  areaIdText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -10,
    marginBottom: 10,
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
  loader: {
    marginVertical: 20,
  },
});

export default SignUp;