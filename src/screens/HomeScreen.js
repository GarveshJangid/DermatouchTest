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
  ScrollView,
} from 'react-native';
import { colors } from '../constant/color';
import productData from '../data/ProductData.json';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const allProducts = productData.products;
    const uniqueCategories = ['All', ...new Set(allProducts.map(p => p.category))];

    setProducts(allProducts);
    setCategories(uniqueCategories);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Product', { product: item })}
    >
      <Image source={{ uri: item.thumbnail || item.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor="#999"
      />
      {/* Category List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.selectedCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({     
  container: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    margin: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#111',
  },
  categoryScroll: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  categoryButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#10b981',
  },
  categoryText: {
    fontSize: 14,
    color: '#444',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#16a34a',
  },
});
