import React, { useEffect, useState } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';

import HomeScreen from './src/screens/home/HomeScreen';
import ProductScreen from './src/screens/home/ProductScreen';
import CartScreen from './src/screens/cart/CartScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import AddressSelectionScreen from './src/screens/addresses/AddressSelectionScreen';
import AddAddressScreen from './src/screens/addresses/AddAddressScreen';
import CheckoutScreen from './src/screens/cart/CheckoutScreen';
import UserScreen from './src/screens/profile/UserScreen';
import MyOrdersScreen from './src/screens/orders/MyOrdersScreen';
import WishlistScreen from './src/screens/profile/WishlistScreen';
import OrderDetailScreen from './src/screens/orders/OrderDetailScreen';
import UpdateProfileScreen from './src/screens/profile/UpdateProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 40 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Wishlist': iconName = focused ? 'heart' : 'heart-outline'; break;
            case 'Orders': iconName = focused ? 'reader' : 'reader-outline'; break;
            case 'Cart': iconName = focused ? 'bag' : 'bag-outline'; break;
            case 'User': iconName = focused ? 'person' : 'person-outline'; break;
          }

          return (
            <View style={{ alignItems: 'center' }}>
              <Icon name={iconName} size={24} color={focused ? '#000' : '#3b82f6'} />
              {focused && (
                <View 
                  style={{ 
                    width: 20, 
                    height: 3, 
                    backgroundColor: '#000', 
                    marginTop: 4, 
                    borderRadius: 2 
                  }} 
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Orders" component={MyOrdersScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.waveEmoji}>👋</Text>
      <Text style={styles.loadingText}>Hello Dermatouch</Text>
    </View>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
          <Stack.Screen name="AddAddress" component={AddAddressScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected && isOnline) {
        setIsOnline(false);
        Alert.alert('No Internet', 'You are offline.');
      } else if (state.isConnected && !isOnline) {
        setIsOnline(true);
        Alert.alert('Connected', 'You are back online.');
      }
    });

    return () => unsubscribe();
  }, [isOnline]);
  
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  waveEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
loadingText: {
  marginTop: 15,
  fontSize: 18,
  color: '#ffffffff',
  fontWeight: '600',
},
});
