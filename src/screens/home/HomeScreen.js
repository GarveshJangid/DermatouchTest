import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
  Switch,
  StatusBar,
  Animated,
} from 'react-native';
import productData from '../../data/ProductData.json';
import { theme } from '../../constant/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive calculations
const isSmallScreen = screenWidth < 375;
const horizontalPadding = screenWidth * 0.04; // 4% of screen width
const cardGap = screenWidth * 0.03; // 3% gap between cards
const cardWidth = (screenWidth - (horizontalPadding * 2) - cardGap) / 2;
const categoriesPerRow = screenWidth < 375 ? 3 : 4;
const categorySize = (screenWidth - (horizontalPadding * 2) - ((categoriesPerRow - 1) * 12)) / categoriesPerRow;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const categoryHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const allProducts = productData.products;
    const uniqueCategories = [
      'All',
      ...new Set(allProducts.map(p => p.category))
    ];
    setProducts(allProducts);
    setCategories(uniqueCategories);
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStock = !inStockOnly || p.stock > 0;
        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortOption === 'priceAsc') return a.price - b.price;
        if (sortOption === 'priceDesc') return b.price - a.price;
        if (sortOption === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchTerm, inStockOnly, sortOption]);

  const renderProductItem = ({ item }) => {
    const discountedPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Product', { product: item })}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: item.thumbnail || item.image }} 
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.discountedPrice}>${discountedPrice}</Text>
          <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
        </View>
        {item.stock === 0 && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = (cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryIcon,
        selectedCategory === cat && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(cat)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryLabel,
          selectedCategory === cat && styles.selectedCategoryText,
        ]}
        numberOfLines={1}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  );

  const handleResetFilters = () => {
    setSortOption(null);
    setInStockOnly(false);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollDifference = currentScrollY - lastScrollY.current;

        // Hide categories when scrolling down, show when scrolling up
        if (scrollDifference > 2 && currentScrollY > 20) {
          // Scrolling down - hide faster
          Animated.timing(categoryHeight, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }).start();
        } else if (scrollDifference < -2 || currentScrollY < 20) {
          // Scrolling up or near top - show faster
          Animated.timing(categoryHeight, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }).start();
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  const categoryContainerHeight = categoryHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, categorySize + 40], // Category size + margins
  });

  const categoryOpacity = categoryHeight.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.heading}>Shop</Text>
        <TextInput
          style={styles.searchInputInline}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={theme.colors.text.disabled}
        />
      </View>

      {/* Category Grid */}
      <View style={styles.categoryGrid}>
        {categories.slice(0, 8).map(renderCategoryItem)}
      </View>

      {/* Products Header */}
      <View style={styles.rowHeader}>
        <Text style={styles.subHeading}>
          All Items {filteredProducts.length > 0 && `(${filteredProducts.length})`}
        </Text>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
          style={styles.filterButton}
        >
          <Image 
            source={require('../../assets/Icon.png')} 
            style={styles.filterIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No products found</Text>
          <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity 
                onPress={handleResetFilters}
                style={styles.resetButton}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Sort By</Text>
            <TouchableOpacity 
              onPress={() => setSortOption('priceAsc')}
              activeOpacity={0.7}
              style={styles.optionButton}
            >
              <Text style={sortOption === 'priceAsc' ? styles.activeOption : styles.modalOption}>
                Price: Low to High
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSortOption('priceDesc')}
              activeOpacity={0.7}
              style={styles.optionButton}
            >
              <Text style={sortOption === 'priceDesc' ? styles.activeOption : styles.modalOption}>
                Price: High to Low
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSortOption('rating')}
              activeOpacity={0.7}
              style={styles.optionButton}
            >
              <Text style={sortOption === 'rating' ? styles.activeOption : styles.modalOption}>
                Rating
              </Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.modalLabel}>In Stock Only</Text>
              <Switch 
                value={inStockOnly} 
                onValueChange={setInStockOnly}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.background}
              />
            </View>

            <Pressable
              style={styles.applyButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: screenHeight * 0.06, // 6% of screen height
    paddingHorizontal: horizontalPadding,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 20,
    gap: isSmallScreen ? 10 : 12,
  },
  heading: {
    fontSize: isSmallScreen ? 22 : theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  searchInputInline: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: theme.borderRadius.xl,
    fontSize: isSmallScreen ? 14 : theme.typography.sizes.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: isSmallScreen ? 20 : 24,
  },
  categoryIcon: {
    width: categorySize,
    height: categorySize,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  categoryLabel: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    fontSize: isSmallScreen ? 10 : theme.typography.sizes.xs,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  selectedCategoryText: {
    color: theme.colors.background,
    fontWeight: theme.typography.weights.semibold,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: isSmallScreen ? 16 : theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  filterButton: {
    padding: 8, // Larger touch target
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.text.primary,
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: theme.colors.background,
    width: cardWidth,
    borderRadius: theme.borderRadius.lg,
    padding: isSmallScreen ? 10 : 12,
    marginBottom: isSmallScreen ? 12 : 16,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: cardWidth * 0.75, // Proportional to card width
    marginBottom: 10,
    borderRadius: theme.borderRadius.sm,
  },
  title: {
    fontSize: isSmallScreen ? 12 : theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountedPrice: {
    fontSize: isSmallScreen ? 14 : theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  originalPrice: {
    fontSize: isSmallScreen ? 11 : theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  outOfStockBadge: {
    marginTop: 6,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  outOfStockText: {
    fontSize: isSmallScreen ? 9 : theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
    fontWeight: theme.typography.weights.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.1,
  },
  emptyStateText: {
    fontSize: isSmallScreen ? 16 : theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: isSmallScreen ? 13 : theme.typography.sizes.base,
    color: theme.colors.text.disabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    padding: isSmallScreen ? 20 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 18 : theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  resetButton: {
    padding: 8, // Larger touch target
  },
  resetText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  modalLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 44, // Minimum touch target height
  },
  modalOption: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.tertiary,
  },
  activeOption: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.bold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
    minHeight: 44, // Minimum touch target height
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 52, // Larger touch target
  },
  applyButtonText: {
    color: theme.colors.background,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.base,
  },
});