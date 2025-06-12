import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import productData from '../data/ProductData.json';
import { Animated } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 40) / 2;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const allProducts = productData.products;
    const uniqueCategories = ['All', ...new Set(allProducts.map(p => p.category))];
    setProducts(allProducts);
    setCategories(uniqueCategories);
  }, []);

  const filteredProducts = products
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

  const renderItem = ({ item }) => {
    const discountedPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Product', { product: item })}
      >
        <Image source={{ uri: item.thumbnail || item.image }} style={styles.image} />
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.discountedPrice}>${discountedPrice}</Text>
          <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Shop</Text>
        <TextInput
          style={styles.searchInputInline}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Grid */}
      <View style={styles.categoryGrid}>
        {categories.slice(0, 9).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryIcon,
              selectedCategory === cat && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(cat)}
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
        ))}
      </View>

      {/* Header with Filter Icon */}
      <View style={styles.rowHeader}>
        <Text style={styles.subHeading}>All Items</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/Icon.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />

      {/* Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>

            <Text style={styles.modalLabel}>Sort By</Text>
            <TouchableOpacity onPress={() => setSortOption('priceAsc')}>
              <Text style={sortOption === 'priceAsc' ? styles.activeOption : styles.modalOption}>
                Price: Low to High
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortOption('priceDesc')}>
              <Text style={sortOption === 'priceDesc' ? styles.activeOption : styles.modalOption}>
                Price: High to Low
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortOption('rating')}>
              <Text style={sortOption === 'rating' ? styles.activeOption : styles.modalOption}>
                Rating
              </Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.modalLabel}>In Stock Only</Text>
              <Switch value={inStockOnly} onValueChange={setInStockOnly} />
            </View>

            <Pressable
              style={styles.applyButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  searchInputInline: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#111',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: -40,
  },
  categoryIcon: {
    width: (screenWidth - 64) / 4,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: '#3b82f6',
  },
  categoryLabel: {
    color: '#333',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'justify',
    paddingHorizontal: 4,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 130,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-end',
},
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 12,
},
modalLabel: {
  fontSize: 14,
  fontWeight: '600',
  marginTop: 14,
  marginBottom: 6,
},
modalOption: {
  paddingVertical: 6,
  fontSize: 14,
  color: '#444',
},
activeOption: {
  paddingVertical: 6,
  fontSize: 14,
  color: '#10b981',
  fontWeight: 'bold',
},
switchRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 20,
},
applyButton: {
  backgroundColor: '#3b82f6',
  marginTop: 20,
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
},
applyButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},

});
