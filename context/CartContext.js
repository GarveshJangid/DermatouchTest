import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

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
    return;
  }

  const invalidItems = cart.filter(
    (item) => item.quantity < (item.minimumOrderQuantity || 1)
  );

  if (invalidItems.length > 0) {
    Alert.alert(
      'Minimum Order Quantity Not Met',
      `Please update quantities for ${invalidItems.length} items.`
    );
    return;
  }

  // Save the order with a timestamp
  const order = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: cart,
  };

  setOrders((prev) => [order, ...prev]); // add order to history
  Alert.alert('Order Placed', 'Thank you for your purchase!');
  setCart([]);
};
const cancelOrder = (orderId) => {
  setOrders((prev) => prev.filter((order) => order.id !== orderId));
};




  return (
   <CartContext.Provider
  value={{
    cart,
    orders,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    buyNow,
    cancelOrder, // ← expose it
  }}
>

  {children}
</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
