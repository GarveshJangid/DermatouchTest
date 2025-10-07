import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04;

export default function AddressSelectionScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const addresses = user.addresses || [];

  const renderAddressCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => navigation.navigate('Checkout', { selectedAddress: item })}
      activeOpacity={0.7}
    >
      <View style={styles.addressHeader}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>
            {item.type === 'Home' ? '🏠' : item.type === 'Work' ? '💼' : '📍'}
          </Text>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddAddress', { 
            editAddress: item, 
            indexToEdit: index 
          })}
          activeOpacity={0.7}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addressDetails}>
        <Text style={styles.addressLine}>{item.line1}</Text>
        {item.line2 ? <Text style={styles.addressLine}>{item.line2}</Text> : null}
        {item.landmark ? (
          <Text style={styles.landmarkText}>Near: {item.landmark}</Text>
        ) : null}
        <Text style={styles.locationText}>
          {item.city}, {item.state} {item.pincode}
        </Text>
        {item.county ? (
          <Text style={styles.countyText}>{item.county}</Text>
        ) : null}
      </View>

      <View style={styles.selectIndicator}>
        <Text style={styles.selectText}>Tap to select →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📦 Select Delivery Address</Text>
          <Text style={styles.headerSubtitle}>
            {addresses.length === 0 
              ? 'Add your first delivery address' 
              : `${addresses.length} saved ${addresses.length === 1 ? 'address' : 'addresses'}`
            }
          </Text>
        </View>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>No addresses yet</Text>
          <Text style={styles.emptySubtitle}>
            Add a delivery address to continue
          </Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAddressCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Fixed Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={() => navigation.navigate('AddAddress')}
          activeOpacity={0.7}
        >
          <Text style={styles.addNewButtonText}>+ Add New Address</Text>
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
  listContent: {
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: 100,
  },
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  typeIcon: {
    fontSize: 20,
  },
  typeText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  editIcon: {
    fontSize: 18,
  },
  addressDetails: {
    marginBottom: theme.spacing.lg,
  },
  addressLine: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  landmarkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    marginTop: theme.spacing.sm,
  },
  countyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  selectIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  selectText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.huge,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.disabled,
    textAlign: 'center',
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
  addNewButton: {
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
  addNewButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});