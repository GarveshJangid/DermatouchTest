import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04;
const imageWidth = screenWidth - (horizontalPadding * 2);

export default function ProductScreen({ route, navigation }) {
  const { product } = route.params;
  const { cart, addToCart, incrementQuantity, decrementQuantity } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const itemInCart = cart.find((item) => item.id === product.id);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!isInWishlist) {
      Alert.alert('Added to Wishlist', 'Product added to your wishlist!');
    }
  };

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
      price: discountedPrice,
      quantity: qty,
    });
    Alert.alert('Success', 'Item added to cart');
  };

  const averageRating = product.reviews?.length
    ? (
        product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      ).toFixed(1)
    : product.rating?.toFixed(1) || 'N/A';

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Wishlist Button - Fixed Position */}
      <TouchableOpacity 
        style={styles.wishlistButton}
        onPress={handleWishlistToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.wishlistIcon}>
          {isInWishlist ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {product.images?.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image 
                source={{ uri: img }} 
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          {/* Title & Brand */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{product.title}</Text>
            {product.brand && (
              <Text style={styles.brand}>{product.brand}</Text>
            )}
          </View>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <View style={styles.tagsContainer}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Price & Discount */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.discountedPrice}>${discountedPrice}</Text>
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            </View>
            {product.discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {averageRating}</Text>
            {product.reviews?.length > 0 && (
              <Text style={styles.reviewCount}>({product.reviews.length} reviews)</Text>
            )}
          </View>
        </View>

        {/* Stock & Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[
              styles.infoValue,
              product.stock > 0 ? styles.inStock : styles.outOfStock
            ]}>
              {product.availabilityStatus}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>In Stock:</Text>
            <Text style={styles.infoValue}>{product.stock} units</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Min. Order:</Text>
            <Text style={styles.infoValue}>{product.minimumOrderQuantity} units</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          
          {product.dimensions && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dimensions:</Text>
              <Text style={styles.infoValue}>
                {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D
              </Text>
            </View>
          )}
          
          {product.weight && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight:</Text>
              <Text style={styles.infoValue}>{product.weight}g</Text>
            </View>
          )}
          
          {product.warrantyInformation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Warranty:</Text>
              <Text style={styles.infoValue}>{product.warrantyInformation}</Text>
            </View>
          )}
          
          {product.shippingInformation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shipping:</Text>
              <Text style={styles.infoValue}>{product.shippingInformation}</Text>
            </View>
          )}
          
          {product.returnPolicy && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Returns:</Text>
              <Text style={styles.infoValue}>{product.returnPolicy}</Text>
            </View>
          )}
        </View>

        {/* QR Code & Barcode */}
        {product.meta?.qrCode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Code</Text>
            <View style={styles.qrContainer}>
              <Image 
                source={{ uri: product.meta.qrCode }} 
                style={styles.qrImage}
                resizeMode="contain"
              />
              {product.meta.barcode && (
                <Text style={styles.barcodeText}>{product.meta.barcode}</Text>
              )}
            </View>
          </View>
        )}

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <Text style={styles.avgRating}>⭐ {averageRating}</Text>
            </View>
            
            {(showAllReviews ? product.reviews : product.reviews.slice(0, 2)).map((review, idx) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                  <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                {review.date && (
                  <Text style={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
            
            {product.reviews.length > 2 && (
              <TouchableOpacity 
                onPress={() => setShowAllReviews(!showAllReviews)}
                style={styles.showMoreButton}
                activeOpacity={0.7}
              >
                <Text style={styles.showMoreText}>
                  {showAllReviews ? 'Show Less' : `Show All ${product.reviews.length} Reviews`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Bottom Spacing for fixed button + navigation */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        {itemInCart ? (
          <View style={styles.cartControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => decrementQuantity(product.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{itemInCart.quantity}</Text>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => incrementQuantity(product.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddToCart}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  wishlistButton: {
    position: 'absolute',
    top: screenHeight * 0.06,
    right: horizontalPadding,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  wishlistIcon: {
    fontSize: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageScroll: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xl,
  },
  imageContainer: {
    width: imageWidth,
    height: imageWidth,
    paddingHorizontal: horizontalPadding,
    paddingVertical: theme.spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: horizontalPadding,
    paddingBottom: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerSection: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: isSmallScreen ? 20 : theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  brand: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.disabled,
    fontWeight: theme.typography.weights.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  tag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
  },
  tagText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  discountedPrice: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success,
  },
  originalPrice: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.background,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  ratingText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  reviewCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
  },
  section: {
    paddingHorizontal: horizontalPadding,
    paddingVertical: theme.spacing.huge,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    flex: 1,
  },
  infoValue: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
    flex: 2,
    textAlign: 'right',
  },
  inStock: {
    color: theme.colors.success,
  },
  outOfStock: {
    color: '#ef4444',
  },
  description: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    padding: theme.spacing.huge,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  qrImage: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
  },
  barcodeText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avgRating: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewerName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  reviewRating: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  reviewComment: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  reviewDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
  },
  showMoreButton: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  showMoreText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: screenHeight * 0.06,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.huge,
    paddingVertical: theme.spacing.sm,
  },
  controlButton: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  controlButtonText: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.background,
  },
  quantityText: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
});