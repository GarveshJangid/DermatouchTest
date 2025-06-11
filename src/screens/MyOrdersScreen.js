import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constant/color';

export default function MyOrdersScreen() {
  const { orders, cancelOrder } = useCart();
  const navigation = useNavigation();

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no past orders.</Text>
      </View>
    );
  }

  const handleCancel = (id) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => cancelOrder(id),
      },
    ]);
  };

 const renderItem = ({ item }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('OrderDetail', { order: item })}
    style={styles.orderCard}
  >
    <View style={styles.orderHeader}>
      <Text style={styles.orderDate}>🗓 {item.date}</Text>
      <TouchableOpacity onPress={() => handleCancel(item.id)}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>

    {item.items.map((prod, index) => (
      <View key={index} style={styles.card}>
        <Image
          source={{ uri: prod.thumbnail || prod.image }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>
            {prod.title}
          </Text>
          <Text style={styles.price}>
            ${prod.price.toFixed(2)} × {prod.quantity}
          </Text>
        </View>
      </View>
    ))}
  </TouchableOpacity>
);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  orderCard: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontWeight: 'bold',
    color: '#16a34a',
  },
  cancelText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: '#4b5563',
  },
});
