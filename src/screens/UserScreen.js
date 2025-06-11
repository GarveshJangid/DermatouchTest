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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../constant/color';

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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Image
          source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=1' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name || 'Guest User'}</Text>
        <Text style={styles.email}>{user.email || 'No email available'}</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('UpdateProfile')}
          style={[styles.logoutButton, { backgroundColor: '#3b82f6' }]}
        >
          <Text style={styles.logoutText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Address list */}
        {user.addresses?.length > 0 && (
          <View style={styles.addressList}>
            <Text style={styles.sectionHeader}>Your Addresses:</Text>
            {user.addresses.map((addr, index) => (
              <View key={index} style={styles.addressCard}>
                <Text style={styles.addrType}>{addr.type}</Text>
                <Text>{addr.line1}</Text>
                {addr.line2 ? <Text>{addr.line2}</Text> : null}
                <Text>{addr.city}, {addr.state} - {addr.pincode}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 15,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressList: {
    marginTop: 30,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  addrType: {
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
});
