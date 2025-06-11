import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CheckoutScreen() {
  const { cart, setCart, setOrders } = useCart();
  const navigation = useNavigation();
  const { selectedAddress } = useRoute().params;

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleConfirmOrder = () => {
    const order = {
      id: Math.floor(100000 + Math.random() * 900000), // random 6-digit
      date: new Date().toLocaleString(),
      items: cart,
      total: getTotalPrice(),
      address: selectedAddress,
    };

    setOrders((prev) => [order, ...prev]);
    setCart([]); 
    Alert.alert('Order Confirmed!', `Order #${order.id} has been placed.`);
    navigation.replace('MyOrders'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Confirm Your Order</Text>

      {/* Address Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text>{selectedAddress.type} - {selectedAddress.line1}</Text>
        <Text>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</Text>
      </View>

      {/* Items Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemQty}>x {item.quantity}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          )}
        />
      </View>

      {/* Total + Confirm Button */}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${getTotalPrice()}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemTitle: { flex: 1, fontSize: 14 },
  itemQty: { width: 40, textAlign: 'center' },
  itemPrice: { fontWeight: '600', color: '#16a34a' },
  footer: { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 12 },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  confirmButton: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
