import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04;

export default function UserScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => logout(navigation),
        style: 'destructive',
      },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const menuItems = [
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      onPress: () => Alert.alert('Coming Soon', 'Notifications feature coming soon!'),
    },
    {
      icon: '⚙️',
      title: 'Settings',
      subtitle: 'Privacy, security & more',
      onPress: () => Alert.alert('Coming Soon', 'Settings feature coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Header Section with Gradient-like effect */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=1' }}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <Text style={styles.badgeText}>✓</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user.email || 'No email available'}</Text>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProfile')}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuCard}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Addresses Section */}
        {user.addresses?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📍 Saved Addresses</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.addNewText}>+ Add New</Text>
              </TouchableOpacity>
            </View>
            
            {user.addresses.map((addr, index) => (
              <View key={index} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTypeContainer}>
                    <Text style={styles.addressIcon}>
                      {addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '💼' : '📍'}
                    </Text>
                    <Text style={styles.addressType}>{addr.type}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.editIconButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.addressLine}>{addr.line1}</Text>
                {addr.line2 ? <Text style={styles.addressLine}>{addr.line2}</Text> : null}
                <Text style={styles.addressLine}>
                  {addr.city}, {addr.state} - {addr.pincode}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Account Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.supportCard} activeOpacity={0.7}>
            <Text style={styles.supportIcon}>💬</Text>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Customer Support</Text>
              <Text style={styles.supportSubtitle}>Get help with your orders</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportCard} activeOpacity={0.7}>
            <Text style={styles.supportIcon}>📄</Text>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Terms & Conditions</Text>
              <Text style={styles.supportSubtitle}>Read our policies</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: screenHeight * 0.06,
    paddingBottom: theme.spacing.huge * 2,
    borderBottomLeftRadius: theme.spacing.huge * 1.5,
    borderBottomRightRadius: theme.spacing.huge * 1.5,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: horizontalPadding,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.background,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.success,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.background,
    fontWeight: theme.typography.weights.bold,
  },
  userName: {
    fontSize: isSmallScreen ? 22 : 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.background,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.background,
    opacity: 0.9,
    marginBottom: theme.spacing.xl,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.huge,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalPadding,
  },
  section: {
    marginTop: theme.spacing.huge,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  addNewText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  menuCard: {
    width: (screenWidth - (horizontalPadding * 2) - theme.spacing.lg) / 2,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.md,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  addressIcon: {
    fontSize: 20,
  },
  addressType: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  editIconButton: {
    padding: theme.spacing.sm,
  },
  editIcon: {
    fontSize: 16,
  },
  addressLine: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  supportIcon: {
    fontSize: 24,
    marginRight: theme.spacing.lg,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  supportSubtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
  },
  arrow: {
    fontSize: 24,
    color: theme.colors.text.disabled,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.huge,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: theme.spacing.md,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
  },
  versionText: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
    marginTop: theme.spacing.huge,
  },
});