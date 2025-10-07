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
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constant/theme';

const { width, height } = Dimensions.get('window');

const scaleFont = (size) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

const scaleSize = (size) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    const result = await login(values.email, values.password);
    setIsLoading(false);
    
    if (result.success) {
      Alert.alert('Success', result.message || 'Login successful!');
      navigation.replace('Main');
    } else {
      Alert.alert('Login Failed', result.message || 'Please check your credentials');
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
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.flexContainer}>
            <View style={styles.container}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Good to see you back! 🖤</Text>

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor={theme.colors.text.disabled}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

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
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

                    <TouchableOpacity 
                      style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
                      onPress={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.nextText}>Login</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Register')}
                      disabled={isLoading}
                    >
                      <Text style={styles.linkText}>
                        Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  flexContainer: {
    justifyContent: 'flex-end',
    paddingBottom: height * 0.05,
    minHeight: height * 0.4,
  },
  container: {
    flexDirection: 'column',
    paddingHorizontal: width * 0.064,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: scaleFont(theme.typography.sizes.xl + 8),
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: scaleSize(theme.spacing.sm),
  },
  subtitle: {
    fontSize: scaleFont(theme.typography.sizes.md + 1),
    color: theme.colors.text.secondary,
    marginBottom: scaleSize(30),
  },
  input: {
    backgroundColor: theme.colors.surface,
    padding: scaleSize(theme.spacing.xxxl),
    borderRadius: scaleSize(theme.borderRadius.lg),
    fontSize: scaleFont(theme.typography.sizes.md + 1),
    marginBottom: scaleSize(theme.spacing.md),
    minHeight: scaleSize(52),
    color: theme.colors.text.primary,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: scaleSize(theme.spacing.md),
  },
  passwordInput: {
    backgroundColor: theme.colors.surface,
    padding: scaleSize(theme.spacing.xxxl),
    paddingRight: scaleSize(50),
    borderRadius: scaleSize(theme.borderRadius.lg),
    fontSize: scaleFont(theme.typography.sizes.md + 1),
    minHeight: scaleSize(52),
    color: theme.colors.text.primary,
  },
  eyeIcon: {
    position: 'absolute',
    right: scaleSize(theme.spacing.xxxl),
    top: '50%',
    transform: [{ translateY: scaleSize(-12) }],
    padding: scaleSize(theme.spacing.xs),
  },
  errorText: {
    color: '#ef4444',
    marginBottom: scaleSize(theme.spacing.md),
    fontSize: scaleFont(theme.typography.sizes.sm + 1),
  },
  nextButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: scaleSize(theme.spacing.xxl),
    borderRadius: scaleSize(theme.borderRadius.xl),
    alignItems: 'center',
    marginBottom: scaleSize(theme.spacing.xxl),
    minHeight: scaleSize(52),
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextText: {
    color: theme.colors.background,
    fontSize: scaleFont(theme.typography.sizes.lg),
    fontWeight: theme.typography.weights.semibold,
  },
  linkText: {
    textAlign: 'center',
    fontSize: scaleFont(theme.typography.sizes.md + 1),
    color: theme.colors.text.secondary,
    paddingVertical: scaleSize(theme.spacing.lg),
  },
  linkTextBold: {
    color: theme.colors.primaryDark,
    fontWeight: theme.typography.weights.semibold,
  },
});
