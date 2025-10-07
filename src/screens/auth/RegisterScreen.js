import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constant/theme';

const { width, height } = Dimensions.get('window');

// Improved responsive scaling functions
const scaleFont = (size) => {
  const baseWidth = 375;
  const scale = width / baseWidth;
  const newSize = size * scale;
  
  // Limit scaling to prevent text from being too large or too small
  if (width < 350) {
    return Math.round(Math.max(newSize, size * 0.85));
  } else if (width > 500) {
    return Math.round(Math.min(newSize, size * 1.3));
  }
  return Math.round(newSize);
};

const scaleSize = (size) => {
  const baseWidth = 375;
  const scale = width / baseWidth;
  const newSize = size * scale;
  
  // Limit scaling for UI elements
  if (width > 500) {
    return Math.round(Math.min(newSize, size * 1.2));
  }
  return Math.round(newSize);
};

// Device size detection
const isSmallDevice = height < 700;
const isTinyDevice = height < 600;
const isTablet = width >= 768;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleRegister = async (values) => {
    Keyboard.dismiss();
    setIsLoading(true);
    
    const result = await register(values.name, values.email, values.password);
    setIsLoading(false);
    
    if (result.success) {
      Alert.alert('Success', result.message || 'Account created successfully!');
      navigation.replace('Main');
    } else {
      Alert.alert('Registration Failed', result.message || 'Please try again');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Bubbles.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
          >
            <View style={styles.flexContainer}>
              <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <Text style={styles.subtitle}>Create your account 🎉</Text>

                <Formik
                  initialValues={{ 
                    name: '', 
                    email: '', 
                    password: '', 
                    confirmPassword: '' 
                  }}
                  validationSchema={RegisterSchema}
                  onSubmit={handleRegister}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.formContainer}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          placeholder="Full Name"
                          placeholderTextColor={theme.colors.text.disabled}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                          style={styles.input}
                          autoCapitalize="words"
                          returnKeyType="next"
                          blurOnSubmit={false}
                          editable={!isLoading}
                        />
                        {touched.name && errors.name && (
                          <Text style={styles.errorText}>{errors.name}</Text>
                        )}
                      </View>

                      <View style={styles.inputWrapper}>
                        <TextInput
                          placeholder="Email"
                          placeholderTextColor={theme.colors.text.disabled}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          style={styles.input}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          returnKeyType="next"
                          blurOnSubmit={false}
                          editable={!isLoading}
                        />
                        {touched.email && errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </View>

                      <View style={styles.inputWrapper}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            placeholder="Password"
                            placeholderTextColor={theme.colors.text.disabled}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={styles.passwordInput}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            editable={!isLoading}
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            activeOpacity={0.7}
                            disabled={isLoading}
                          >
                            <Icon
                              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                              size={scaleSize(24)}
                              color={theme.colors.text.tertiary}
                            />
                          </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && (
                          <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                      </View>

                      <View style={styles.inputWrapper}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.colors.text.disabled}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            style={styles.passwordInput}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                            editable={!isLoading}
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            activeOpacity={0.7}
                            disabled={isLoading}
                          >
                            <Icon
                              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                              size={scaleSize(24)}
                              color={theme.colors.text.tertiary}
                            />
                          </TouchableOpacity>
                        </View>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                      </View>

                      <TouchableOpacity 
                        style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Text style={styles.nextText}>Register</Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                        disabled={isLoading}
                        style={styles.loginLinkContainer}
                      >
                        <Text style={styles.linkText}>
                          Already have an account? <Text style={styles.linkTextBold}>Login</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' 
      ? (isTinyDevice ? 10 : isSmallDevice ? 15 : 20)
      : (isTinyDevice ? 15 : isSmallDevice ? 20 : 25),
  },
  flexContainer: {
    justifyContent: 'flex-end',
    paddingBottom: isTinyDevice 
      ? height * 0.01 
      : isSmallDevice 
        ? height * 0.02 
        : isTablet 
          ? height * 0.08 
          : height * 0.04,
    minHeight: isTinyDevice 
      ? height * 0.65 
      : isSmallDevice 
        ? height * 0.6 
        : isTablet 
          ? height * 0.5 
          : height * 0.55,
  },
  container: {
    flexDirection: 'column',
    paddingHorizontal: isTablet ? width * 0.15 : width * 0.064,
    paddingTop: scaleSize(isTinyDevice ? 15 : isSmallDevice ? 18 : 20),
    justifyContent: 'flex-start',
    maxWidth: isTablet ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: scaleFont(
      isTinyDevice ? 28 : isSmallDevice ? 32 : isTablet ? 44 : 40
    ),
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: scaleSize(isTinyDevice ? 2 : isSmallDevice ? 4 : 8),
  },
  subtitle: {
    fontSize: scaleFont(
      isTinyDevice ? 13 : isSmallDevice ? 14 : isTablet ? 18 : 17
    ),
    color: theme.colors.text.secondary,
    marginBottom: scaleSize(isTinyDevice ? 16 : isSmallDevice ? 20 : isTablet ? 35 : 28),
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: scaleSize(isTinyDevice ? 4 : isSmallDevice ? 6 : 8),
  },
  input: {
    backgroundColor: theme.colors.surface,
    padding: scaleSize(isTinyDevice ? 12 : isSmallDevice ? 14 : isTablet ? 18 : 16),
    borderRadius: scaleSize(isTinyDevice ? 10 : isSmallDevice ? 12 : 14),
    fontSize: scaleFont(isTinyDevice ? 14 : isSmallDevice ? 15 : isTablet ? 18 : 17),
    minHeight: scaleSize(isTinyDevice ? 44 : isSmallDevice ? 48 : isTablet ? 58 : 54),
    color: theme.colors.text.primary,
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    backgroundColor: theme.colors.surface,
    padding: scaleSize(isTinyDevice ? 12 : isSmallDevice ? 14 : isTablet ? 18 : 16),
    paddingRight: scaleSize(isTinyDevice ? 44 : isSmallDevice ? 48 : isTablet ? 56 : 52),
    borderRadius: scaleSize(isTinyDevice ? 10 : isSmallDevice ? 12 : 14),
    fontSize: scaleFont(isTinyDevice ? 14 : isSmallDevice ? 15 : isTablet ? 18 : 17),
    minHeight: scaleSize(isTinyDevice ? 44 : isSmallDevice ? 48 : isTablet ? 58 : 54),
    color: theme.colors.text.primary,
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: scaleSize(isTinyDevice ? 10 : isSmallDevice ? 12 : 16),
    top: '50%',
    transform: [{ translateY: scaleSize(-12) }],
    padding: scaleSize(4),
    zIndex: 10,
  },
  errorText: {
    color: '#ef4444',
    fontSize: scaleFont(isTinyDevice ? 11 : isSmallDevice ? 12 : isTablet ? 15 : 13),
    marginTop: scaleSize(4),
    paddingHorizontal: scaleSize(4),
  },
  nextButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: scaleSize(isTinyDevice ? 12 : isSmallDevice ? 14 : isTablet ? 18 : 16),
    borderRadius: scaleSize(isTinyDevice ? 12 : isSmallDevice ? 14 : 16),
    alignItems: 'center',
    marginTop: scaleSize(isTinyDevice ? 8 : isSmallDevice ? 10 : isTablet ? 20 : 16),
    marginBottom: scaleSize(isTinyDevice ? 10 : isSmallDevice ? 12 : isTablet ? 20 : 16),
    minHeight: scaleSize(isTinyDevice ? 44 : isSmallDevice ? 48 : isTablet ? 58 : 54),
    justifyContent: 'center',
    width: '100%',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextText: {
    color: theme.colors.background,
    fontSize: scaleFont(isTinyDevice ? 15 : isSmallDevice ? 16 : isTablet ? 20 : 18),
    fontWeight: theme.typography.weights.semibold,
  },
  loginLinkContainer: {
    paddingVertical: scaleSize(isTinyDevice ? 6 : isSmallDevice ? 8 : 12),
    marginBottom: scaleSize(isTinyDevice ? 15 : isSmallDevice ? 20 : 0),
  },
  linkText: {
    textAlign: 'center',
    fontSize: scaleFont(isTinyDevice ? 13 : isSmallDevice ? 14 : isTablet ? 17 : 16),
    color: theme.colors.text.secondary,
  },
  linkTextBold: {
    color: theme.colors.primaryDark,
    fontWeight: theme.typography.weights.semibold,
  },
});