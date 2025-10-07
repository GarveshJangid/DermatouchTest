import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04;

export default function CheckoutScreen() {
  const { cart, setCart, setOrders } = useCart();
  const navigation = useNavigation();
  const { selectedAddress } = useRoute().params;

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = () => {
    const order = {
      id: Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString(),
      items: cart,
      total: getTotalPrice(),
      address: selectedAddress,
    };

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    Alert.alert('Order Confirmed! 🎉', `Order #${order.id} has been placed successfully.`);
    navigation.replace('MyOrders');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || item.thumbnail }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.itemQuantity}>× {item.quantity}</Text>
        </View>
        <Text style={styles.itemTotal}>
          Total: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>✅ Confirm Your Order</Text>
          <Text style={styles.headerSubtitle}>
            Review your order details before confirming
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📦 Delivery Address</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressContent}>
            <View style={styles.addressTypeRow}>
              <Text style={styles.addressTypeIcon}>
                {selectedAddress.type === 'Home' ? '🏠' : selectedAddress.type === 'Work' ? '💼' : '📍'}
              </Text>
              <Text style={styles.addressType}>{selectedAddress.type}</Text>
            </View>
            <Text style={styles.addressLine}>{selectedAddress.line1}</Text>
            {selectedAddress.line2 ? (
              <Text style={styles.addressLine}>{selectedAddress.line2}</Text>
            ) : null}
            {selectedAddress.landmark ? (
              <Text style={styles.landmarkText}>Near: {selectedAddress.landmark}</Text>
            ) : null}
            <Text style={styles.locationText}>
              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
            </Text>
          </View>
        </View>

        {/* Order Items Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            🛍️ Order Items ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
          </Text>

          <View style={styles.itemsList}>
            {cart.map((item) => (
              <View key={item.id}>
                {renderItem({ item })}
              </View>
            ))}
          </View>
        </View>

        {/* Price Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Price Details</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({getTotalItems()} items)</Text>
            <Text style={styles.summaryValue}>${getTotalPrice()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${getTotalPrice()}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomSummary}>
          <View>
            <Text style={styles.bottomTotalLabel}>Total Amount</Text>
            <Text style={styles.bottomTotalValue}>${getTotalPrice()}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxxl,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  changeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  changeButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
  addressContent: {
    marginTop: -theme.spacing.sm,
  },
  addressTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  addressTypeIcon: {
    fontSize: 18,
  },
  addressType: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  addressLine: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  landmarkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    marginTop: theme.spacing.sm,
  },
  itemsList: {
    marginTop: -theme.spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.lg,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  itemQuantity: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
  },
  itemTotal: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  freeText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  bottomSpacing: {
    height: 180,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    paddingHorizontal: horizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: screenHeight * 0.06,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  bottomTotalLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  bottomTotalValue: {
    fontSize: theme.typography.sizes.xl - 2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  confirmButton: {
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
  confirmButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});