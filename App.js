import React, { useEffect } from 'react';
import { Alert, View, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

import HomeScreen from './src/screens/HomeScreen';
import ProductScreen from './src/screens/ProductScreen';
import CartScreen from './src/screens/CartScreen';
import LoginScreen from './src/screens/LoginScreen';
import AddressSelectionScreen from './src/screens/AddressSelectionScreen';
import AddAddressScreen from './src/screens/AddAddressScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import UserScreen from './src/screens/UserScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import UpdateProfileScreen from './src/screens/UpdateProfileScreen';
import { WishlistProvider } from './context/WishlistContext';
import { colors } from './src/constant/color';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: '#fff',
          borderTopColor: '#eee',
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
              {focused && <View style={{ width: 20, height: 3, backgroundColor: '#000', marginTop: 4, borderRadius: 2 }} />}
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


export default function App() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert('No Internet', 'You are offline.');
      } else {
        Alert.alert('Connected', 'You are online.');
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    
    <AuthProvider>
      <CartProvider>
          <WishlistProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
  <Stack.Screen
    name="Login"
    component={LoginScreen}
    options={{ headerShown: false }}
  />
  <Stack.Screen
    name="Main"
    component={MainTabs}
    options={{ headerShown: false }}
  />
  <Stack.Screen
    name="Product"
    component={ProductScreen}
    options={{ title: 'Product Details' }}
  />
  <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
<Stack.Screen name="AddAddress" component={AddAddressScreen} />
<Stack.Screen name="Checkout" component={CheckoutScreen} />
  <Stack.Screen
  name="MyOrders"
  component={MyOrdersScreen}
  options={{ title: 'My Orders' }}
/>
<Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
  <Stack.Screen
    name="UpdateProfile"
    component={UpdateProfileScreen}
    options={{ title: 'Edit Profile' }}
  />

</Stack.Navigator>

        </NavigationContainer>
          </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

