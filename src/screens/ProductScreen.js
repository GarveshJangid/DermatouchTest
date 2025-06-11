import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { colors } from '../constant/color';
import QRCode from 'react-native-qrcode-svg';

export default function ProductScreen({ route }) {
  const { product } = route.params;
  const { cart, addToCart, incrementQuantity, decrementQuantity } = useCart();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const itemInCart = cart.find((item) => item.id === product.id);

  const handleAddToCart = () => {
  const qty = product.minimumOrderQuantity || 1;

  if (qty > product.stock) {
    Alert.alert('Stock Limit Exceeded', `Only ${product.stock} item(s) available in stock.`);
    return;
  }

  if (qty < product.minimumOrderQuantity) {
    Alert.alert(
      'Minimum Order Required',
      `You must order at least ${product.minimumOrderQuantity} item(s).`
    );
    return;
  }

  const discountedPrice = parseFloat(
  (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
);

addToCart({
  ...product,
  price: discountedPrice, // ⬅ override with discounted price
  quantity: qty,
});
  Alert.alert('Success', 'Item added to cart');
};


  const averageRating = product.reviews?.length
    ? (
        product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      ).toFixed(1)
    : product.rating?.toFixed(1) || 'N/A';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {/* Multiple Images */}
      <ScrollView horizontal pagingEnabled style={styles.imageScroll}>
        {product.images?.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Title + Brand + Tags */}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.brand}>{product.brand}</Text>
      <View style={styles.tags}>
        {product.tags?.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>

      {/* Price & Discount */}
      <View style={styles.priceRow}>
        <Text style={styles.discountPrice}>
          ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
        </Text>
        <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.discount}>-{product.discountPercentage}%</Text>
      </View>

      {/* Availability, Stock, MOQ */}
      <Text style={styles.meta}>Availability: {product.availabilityStatus}</Text>
      <Text style={styles.meta}>In Stock: {product.stock}</Text>
      <Text style={styles.meta}>Minimum Order Qty: {product.minimumOrderQuantity}</Text>

      {/* Dimensions */}
      <Text style={styles.meta}>
        Dimensions: {product.dimensions.width}W x {product.dimensions.height}H x {product.dimensions.depth}D
      </Text>
      <Text style={styles.meta}>Weight: {product.weight}g</Text>

      {/* Warranty / Shipping / Return */}
      <Text style={styles.meta}>Warranty: {product.warrantyInformation}</Text>
      <Text style={styles.meta}>Shipping: {product.shippingInformation}</Text>
      <Text style={styles.meta}>Return Policy: {product.returnPolicy}</Text>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <Image source={{ uri: product.meta.qrCode }} style={{ width: 100, height: 100 }} />
        <Text style={styles.meta}>Barcode: {product.meta.barcode}</Text>
      </View>

      {/* Description */}
      <Text style={styles.section}>About</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Rating + Reviews */}
      <Text style={styles.section}>Reviews (Avg: {averageRating})</Text>
      {(showAllReviews ? product.reviews : product.reviews?.slice(0, 1))?.map((r, idx) => (
        <View key={idx} style={styles.review}>
          <Text style={styles.reviewUser}>{r.reviewerName}</Text>
          <Text style={styles.reviewRating}>⭐ {r.rating}</Text>
          <Text style={styles.reviewComment}>{r.comment}</Text>
        </View>
      ))}
      {product.reviews?.length > 1 && (
        <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
          <Text style={styles.showMore}>
            {showAllReviews ? 'Show Less' : 'Show More Reviews'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Cart Controls */}
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
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  imageScroll: {
    marginBottom: 20,
  },
  image: {
    width: 280,
    height: 280,
    marginRight: 10,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  brand: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    color: '#444',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discount: {
    fontSize: 14,
    color: '#ef4444',
  },
  meta: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  review: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  reviewUser: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewRating: {
    color: '#f59e0b',
    fontSize: 13,
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  showMore: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgb(52, 239, 111)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginTop: 16,
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
    marginTop: 20,
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
