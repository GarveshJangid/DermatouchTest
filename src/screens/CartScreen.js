import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../constant/color';
import { useCart } from '../../context/CartContext';

export default function CartScreen({ navigation }) {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    buyNow,
  } = useCart();

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const renderItem = ({ item }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Product', { product: item })}>
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)} x {item.quantity}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => decrementQuantity(item.id)}
          >
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => incrementQuantity(item.id)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.heading}>🛒 Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
            <TouchableOpacity style={styles.buyButton} onPress={buyNow}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fefefe',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 30,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  price: {
    color: '#4b5563',
    marginTop: 2,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  counterBtn: {
    backgroundColor: 'rgb(52, 239, 111)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  removeText: {
    fontSize: 20,
    color: '#ef4444',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 14,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'right',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: 'rgb(52, 239, 111)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
