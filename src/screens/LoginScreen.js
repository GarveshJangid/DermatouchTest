import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const handleLogin = async (values) => {
    const success = await login(values.email, 'default_password');
    if (success) {
      navigation.replace('Main');
    } else {
      Alert.alert('Login Failed', 'Check your credentials');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Bubbles.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.flexContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Good to see you back! 🖤</Text>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  paddingBottom: 40, // spacing from bottom
},
  container: {
    flexDirection : 'column',
    paddingHorizontal: 24,
    justifyContent: 'baseline'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});
