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
import { useWishlist } from '../../context/WishlistContext';
import { colors } from '../constant/color';

export default function WishlistScreen({ navigation }) {
  const { wishlist, toggleWishlist } = useWishlist();

  const handleRemove = (product) => {
    Alert.alert('Remove', 'Remove this item from wishlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => toggleWishlist(product),
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Product', { product: item })}
    >
      <Image source={{ uri: item.thumbnail || item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item)}>
        <Text style={styles.removeText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wishlist}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: '#444',
  },
  removeText: {
    fontSize: 20,
    color: '#ef4444',
  },
});
