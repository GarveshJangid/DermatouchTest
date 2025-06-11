import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  type: Yup.string().required('Address type is required'),
  line1: Yup.string().required('Address Line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be 6 digits')
    .required('Pincode is required'),
});

export default function AddAddressScreen() {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { editAddress = null, indexToEdit = null } = route.params || {};

  return (
    <Formik
      initialValues={{
        type: editAddress?.type || 'Home',
        line1: editAddress?.line1 || '',
        line2: editAddress?.line2 || '',
        landmark: editAddress?.landmark || '',
        city: editAddress?.city || '',
        state: editAddress?.state || '',
        county: editAddress?.county || '',
        pincode: editAddress?.pincode || '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        let updatedAddresses = user.addresses || [];
        if (indexToEdit !== null) {
          updatedAddresses[indexToEdit] = values;
        } else {
          updatedAddresses = [...updatedAddresses, values];
        }
        updateUser({ addresses: updatedAddresses });
        Alert.alert(indexToEdit !== null ? 'Address Updated' : 'Address Added');
        navigation.goBack();
      }}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Address Type</Text>
          <TextInput placeholder="Address Line 1 *" value={values.line1} onChangeText={handleChange('line1')} style={styles.input} />
          {errors.line1 && <Text style={styles.error}>{errors.line1}</Text>}
          <TextInput placeholder="City *" value={values.city} onChangeText={handleChange('city')} style={styles.input} />
          {errors.city && <Text style={styles.error}>{errors.city}</Text>}
          <TextInput placeholder="State *" value={values.state} onChangeText={handleChange('state')} style={styles.input} />
          {errors.state && <Text style={styles.error}>{errors.state}</Text>}
          <TextInput placeholder="Pincode *" value={values.pincode} onChangeText={handleChange('pincode')} keyboardType="numeric" style={styles.input} />
          {errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <Text style={styles.saveText}>{indexToEdit !== null ? 'Update Address' : 'Save Address'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12 },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
  saveButton: { backgroundColor: '#10b981', padding: 14, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold' },
});