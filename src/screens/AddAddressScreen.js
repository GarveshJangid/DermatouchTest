import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

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
      Alert.alert('Please fill all required fields.');
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
    Alert.alert(indexToEdit !== null ? 'Address Updated' : 'Address Added');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Address Type</Text>
      <View style={styles.row}>
        {['Home', 'Work', 'Other'].map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setType(opt)}
            style={[styles.typeButton, type === opt && styles.activeType]}
          >
            <Text style={type === opt && styles.activeText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {type === 'Other' && (
        <TextInput
          placeholder="Enter custom type"
          value={customType}
          onChangeText={setCustomType}
          style={styles.input}
        />
      )}

      <TextInput placeholder="Address Line 1 *" value={line1} onChangeText={setLine1} style={styles.input} />
      <TextInput placeholder="Address Line 2" value={line2} onChangeText={setLine2} style={styles.input} />
      <TextInput placeholder="Landmark" value={landmark} onChangeText={setLandmark} style={styles.input} />
      <TextInput placeholder="City *" value={city} onChangeText={setCity} style={styles.input} />
      <TextInput placeholder="State *" value={state} onChangeText={setState} style={styles.input} />
      <TextInput placeholder="County" value={county} onChangeText={setCounty} style={styles.input} />
      <TextInput placeholder="Pincode *" value={pincode} onChangeText={setPincode} keyboardType="numeric" style={styles.input} />

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveText}>{indexToEdit !== null ? 'Update Address' : 'Save Address'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 12, gap: 10 },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  activeType: { backgroundColor: '#3b82f6' },
  activeText: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
});
