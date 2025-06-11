import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function AddressSelectionScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const addresses = user.addresses || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Delivery Address</Text>

      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Checkout', { selectedAddress: item })}
          >
            <Text style={styles.title}>{item.type}</Text>
            <Text>{item.line1}</Text>
            <Text>{item.city}, {item.state}, {item.pincode}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addNewButton}
        onPress={() => navigation.navigate('AddAddress')}
      >
        <Text style={styles.addNewText}>+ Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  title: { fontWeight: 'bold', marginBottom: 4 },
  addNewButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addNewText: { color: '#fff', fontWeight: 'bold' },
});
