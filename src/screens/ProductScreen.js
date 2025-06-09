import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../constant/color';
import { useCart } from '../../context/CartContext';

export default function ProductScreen({ route }) {
  const { product } = route.params;
  const { cart, addToCart, incrementQuantity, decrementQuantity } = useCart();

  const itemInCart = cart.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Success', 'Item added to cart');
  };

  // Sample logic: assume 10% discount
  const discountPrice = product.price - product.price * 0.1;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: product.image || product.thumbnail }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>

      {/* Discounted price + original price */}
      <View style={styles.priceRow}>
        <Text style={styles.discountPrice}>${discountPrice.toFixed(2)}</Text>
        <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
      </View>

      {/* Rating */}
      <Text style={styles.rating}>⭐ {product.rating || '4.5'} / 5</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {product.category && <Text style={styles.tag}>{product.category}</Text>}
        {product.brand && <Text style={styles.tag}>{product.brand}</Text>}
      </View>

      {/* Stock */}
      <Text style={styles.stock}>
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
      </Text>

      <Text style={styles.sectionHeader}>About</Text>
      <Text style={styles.description}>
        {product.description?.length > 150
          ? `${product.description.substring(0, 150)}...`
          : product.description}
      </Text>

      {itemInCart ? (
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => decrementQuantity(product.id)}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{itemInCart.quantity}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => incrementQuantity(product.id)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.button, { opacity: product.stock === 0 ? 0.5 : 1 }]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  rating: {
    fontSize: 15,
    color: '#f59e0b',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    color: '#333',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stock: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    color: '#4b5563',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: 'rgb(52, 239, 111)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  counterBtn: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
