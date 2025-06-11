import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function OrderDetailScreen({ route }) {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order #{order.id}</Text>
      <Text style={styles.sub}>Placed on: {order.date}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text>{order.address.type} - {order.address.line1}</Text>
        <Text>{order.address.city}, {order.address.state} - {order.address.pincode}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>x{item.quantity}</Text>
              <Text>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          )}
        />
      </View>

      <Text style={styles.total}>Total: ${order.total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  sub: { fontSize: 13, color: '#888', marginBottom: 12 },
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 6 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemTitle: { flex: 1 },
  total: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
  },
});
