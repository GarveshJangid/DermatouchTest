import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../context/AuthContext';

export default function UpdateProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets?.[0]?.uri) {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Name and email are required.');
      return;
    }
    updateUser({ name, email, avatar });
    Alert.alert('Success', 'Profile updated');
    navigation.goBack();
  };

  const handleDelete = (index) => {
    const updated = [...user.addresses];
    updated.splice(index, 1);
    updateUser({ addresses: updated });
  };

  const handleEdit = (index) => {
    navigation.navigate('AddAddress', {
      editAddress: user.addresses[index],
      indexToEdit: index,
    });
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Avatar</Text>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.addButton}
  onPress={() => navigation.navigate('AddAddress')}
>
  <Text style={styles.addButtonText}>+ Add New Address</Text>
</TouchableOpacity>

        {user.addresses?.length > 0 && (
          <View style={styles.addressContainer}>
            <Text style={styles.sectionHeader}>Saved Addresses</Text>
            {user.addresses.map((addr, index) => (
              <View key={index} style={styles.editCard}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{addr.type}</Text>
                  <Text>{addr.line1}</Text>
                  {addr.line2 ? <Text>{addr.line2}</Text> : null}
                  <Text>{addr.city}, {addr.state} - {addr.pincode}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editBtn}>
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteBtn}>
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  placeholderText: {
    color: '#999',
    marginVertical: 10,
  },
  imageButton: {
    backgroundColor: '#6b7280',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    marginTop: 30,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actions: {
    justifyContent: 'space-between',
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
  marginTop: 20,
  backgroundColor: '#3b82f6',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
addButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
}, 
});
