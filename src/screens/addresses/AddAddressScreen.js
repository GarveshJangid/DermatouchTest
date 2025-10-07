import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04;

export default function AddAddressScreen() {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  const { editAddress = null, indexToEdit = null } = route.params || {};

  const [type, setType] = useState(editAddress?.type || 'Home');
  const [customType, setCustomType] = useState('');
  const [line1, setLine1] = useState(editAddress?.line1 || '');
  const [line2, setLine2] = useState(editAddress?.line2 || '');
  const [landmark, setLandmark] = useState(editAddress?.landmark || '');
  const [city, setCity] = useState(editAddress?.city || '');
  const [state, setState] = useState(editAddress?.state || '');
  const [county, setCounty] = useState(editAddress?.county || '');
  const [pincode, setPincode] = useState(editAddress?.pincode || '');

  const handleSave = () => {
    if (!line1 || !city || !state || !pincode || (type === 'Other' && !customType)) {
      Alert.alert('Missing Information', 'Please fill all required fields.');
      return;
    }

    const newAddress = {
      type: type === 'Other' ? customType : type,
      line1,
      line2,
      landmark,
      city,
      state,
      county,
      pincode,
    };

    let updatedAddresses = user.addresses || [];

    if (indexToEdit !== null) {
      updatedAddresses[indexToEdit] = newAddress;
    } else {
      updatedAddresses = [...updatedAddresses, newAddress];
    }

    updateUser({ addresses: updatedAddresses });
    Alert.alert('Success', indexToEdit !== null ? 'Address Updated' : 'Address Added');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {indexToEdit !== null ? '📝 Edit Address' : '📍 Add New Address'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {indexToEdit !== null ? 'Update your delivery address' : 'Enter your delivery details'}
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Type Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Address Type</Text>
          <View style={styles.typeRow}>
            {['Home', 'Work', 'Other'].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setType(opt)}
                style={[styles.typeButton, type === opt && styles.activeType]}
                activeOpacity={0.7}
              >
                <Text style={[styles.typeText, type === opt && styles.activeTypeText]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {type === 'Other' && (
            <TextInput
              placeholder="Enter custom type"
              value={customType}
              onChangeText={setCustomType}
              style={styles.input}
              placeholderTextColor={theme.colors.text.disabled}
            />
          )}
        </View>

        {/* Address Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Address Details</Text>
          
          <TextInput
            placeholder="Address Line 1 *"
            value={line1}
            onChangeText={setLine1}
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
          
          <TextInput
            placeholder="Address Line 2"
            value={line2}
            onChangeText={setLine2}
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
          
          <TextInput
            placeholder="Landmark"
            value={landmark}
            onChangeText={setLandmark}
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Location Details</Text>
          
          <TextInput
            placeholder="City *"
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
          
          <TextInput
            placeholder="State *"
            value={state}
            onChangeText={setState}
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
          
          <TextInput
            placeholder="County"
            value={county}
            onChangeText={setCounty}
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
          
          <TextInput
            placeholder="Pincode *"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={theme.colors.text.disabled}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>
            {indexToEdit !== null ? 'Update Address' : 'Save Address'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: horizontalPadding,
    paddingTop: screenHeight * 0.06,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.disabled,
  },
  scrollContent: {
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxxl,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  typeRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeType: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
  },
  activeTypeText: {
    color: theme.colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: screenHeight * 0.06,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});