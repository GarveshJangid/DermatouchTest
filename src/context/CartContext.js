import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userAddress, setUserAddress] = useState(null);

  const addToCart = (product) => {
  const exists = cart.find((item) => item.id === product.id);
  if (exists) {
    // If already in cart, increase its quantity
    setCart((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      )
    );
  } else {
    // If new, add with given quantity
    setCart((prev) => [...prev, { ...product, quantity: product.quantity }]);
  }
};


  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  const buyNow = () => {
  if (cart.length === 0) {
    Alert.alert('Cart is empty', 'Please add items before buying.');
    return false;
  }

  const invalidItems = cart.filter(
    (item) => item.quantity < (item.minimumOrderQuantity || 1)
  );

  if (invalidItems.length > 0) {
    Alert.alert(
      'Minimum Order Quantity Not Met',
      `Please update quantities for ${invalidItems.length} item(s).`
    );
    return false;
  }

  return true; // cart is valid
};


const cancelOrder = (orderId) => {
  setOrders((prev) => prev.filter((order) => order.id !== orderId));
};

useEffect(() => {
  const loadOrders = async () => {
    try {
      const data = await AsyncStorage.getItem('orders');
      if (data) {
        setOrders(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };
  loadOrders();
}, []);



// Save orders when updated
useEffect(() => {
  const saveOrders = async () => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  saveOrders();
}, [orders]);




  return (
   <CartContext.Provider
  value={{
    cart,
    setCart,
    orders,
    setOrders,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    buyNow,
    cancelOrder,
    userAddress,     
    setUserAddress,  
  }}
>

  {children}
</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
