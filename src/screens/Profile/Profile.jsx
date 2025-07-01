import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import styles from './styles';
import { updateUserProfile } from '../../services/api/profileService';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    division: '',
    subDivision: '',
    area: '',
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Get data from user object and unsafe metadata
      const unsafeMetadata = user.unsafeMetadata;
      
      setProfile({
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        phoneNumber: unsafeMetadata?.phoneNumber || '',
        division: unsafeMetadata?.division || '',
        subDivision: unsafeMetadata?.subDivision || '',
        area: unsafeMetadata?.area || '',
      });
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!profile.phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      // Call API to update profile
      await updateUserProfile({
        name: profile.name,
        phoneNumber: profile.phoneNumber,
      });
      
      // Update user metadata in Clerk would go here in production
      // This is just a mock for now

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by your auth state observer
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.profileHeaderContent}>
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user-circle" size={64} color="#007AFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <View style={styles.divisionBadge}>
              <Text style={styles.divisionText}>{profile.division}</Text>
            </View>
          </View>
        </View>
        
        {!isEditing && (
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={() => setIsEditing(true)}
          >
            <FontAwesome5 name="edit" size={16} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="id-card" size={16} color="#007AFF" />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelContainer}>
            <FontAwesome5 name="user" size={14} color="#6c757d" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Name</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.inputField}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter name"
            />
          ) : (
            <Text style={styles.fieldValue}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelContainer}>
            <FontAwesome5 name="envelope" size={14} color="#6c757d" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Email</Text>
          </View>
          <Text style={styles.fieldValue}>{profile.email}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelContainer}>
            <FontAwesome5 name="phone" size={14} color="#6c757d" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Phone</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.inputField}
              value={profile.phoneNumber}
              onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>{profile.phoneNumber}</Text>
          )}
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="building" size={16} color="#007AFF" />
          <Text style={styles.cardTitle}>Division Information</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelContainer}>
            <FontAwesome5 name="map-marker-alt" size={14} color="#6c757d" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Division</Text>
          </View>
          <Text style={styles.fieldValue}>{profile.division}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelContainer}>
            <FontAwesome5 name="layer-group" size={14} color="#6c757d" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Sub Division</Text>
          </View>
          <Text style={styles.fieldValue}>{profile.subDivision}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelContainer}>
            <FontAwesome5 name="map" size={14} color="#6c757d" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Area</Text>
          </View>
          <Text style={styles.fieldValue}>{profile.area}</Text>
        </View>
      </View>

      {isEditing && (
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="save" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setIsEditing(false)}
            disabled={isSaving}
          >
            <FontAwesome5 name="times" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.detailsCard}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="shield-alt" size={16} color="#007AFF" />
          <Text style={styles.cardTitle}>Account Security</Text>
        </View>

        <View style={styles.cardDivider} />

        <TouchableOpacity 
          style={styles.securityOption}
          onPress={() => {
            Alert.alert(
              'Password Reset',
              'An email will be sent to your registered email address with instructions to reset your password.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Send Reset Email',
                  onPress: () => Alert.alert('Success', 'Password reset email has been sent.')
                }
              ]
            );
          }}
        >
          <View style={styles.securityOptionIcon}>
            <FontAwesome5 name="key" size={14} color="#fff" />
          </View>
          <View style={styles.securityOptionContent}>
            <Text style={styles.securityOptionTitle}>Change Password</Text>
            <Text style={styles.securityOptionDescription}>Update your account password</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color="#6c757d" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <FontAwesome5 name="sign-out-alt" size={18} color="#fff" style={styles.signOutIcon} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      
      <View style={styles.bottomPadding}></View>
    </ScrollView>
  );
};

export default Profile;