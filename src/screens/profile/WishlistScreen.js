import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useWishlist } from '../../context/WishlistContext';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04;

export default function WishlistScreen({ navigation }) {
  const { wishlist, toggleWishlist } = useWishlist();

  const handleRemove = (product) => {
    Alert.alert('Remove from Wishlist', 'Remove this item from your wishlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => toggleWishlist(product),
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const discountedPrice = item.discountPercentage 
      ? (item.price * (1 - item.discountPercentage / 100)).toFixed(2)
      : item.price.toFixed(2);

    return (
      <TouchableOpacity
        style={styles.wishlistItem}
        onPress={() => navigation.navigate('Product', { product: item })}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.thumbnail || item.image }} 
            style={styles.productImage}
            resizeMode="contain"
          />
          {item.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          {item.brand && (
            <Text style={styles.brandText}>{item.brand}</Text>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${discountedPrice}</Text>
            {item.discountPercentage > 0 && (
              <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
            )}
          </View>

          <View style={styles.stockInfo}>
            {item.stock > 0 ? (
              <Text style={styles.inStockText}>✓ In Stock</Text>
            ) : (
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeIcon}>❤️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>❤️ Wishlist</Text>
          <Text style={styles.headerSubtitle}>Your favorite items</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💝</Text>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Save items you love to find them easily later
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.shopButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>❤️ Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </Text>
        </View>
      </View>

      {/* Wishlist Items */}
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: horizontalPadding,
    paddingTop: screenHeight * 0.06,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.disabled,
  },
  listContent: {
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: 20,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.background,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  brandText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
    marginBottom: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  currentPrice: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success,
  },
  originalPrice: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  stockInfo: {
    marginTop: theme.spacing.xs,
  },
  inStockText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
  },
  outOfStockText: {
    fontSize: theme.typography.sizes.xs,
    color: '#ef4444',
    fontWeight: theme.typography.weights.medium,
  },
  removeButton: {
    padding: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.huge,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.disabled,
    textAlign: 'center',
    marginBottom: theme.spacing.huge,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.huge * 1.5,
    paddingVertical: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shopButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
  },
});