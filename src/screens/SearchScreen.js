import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { colors } from '../constant/color';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products').then((res) => {
      setProducts(res.data);
      setFilteredProducts(res.data); // initialize with all products
    });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const results = products.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }, 400); // debounce delay: 400ms

    return () => clearTimeout(delayDebounce); // cleanup previous timeout
  }, [query, products]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Product', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        placeholder="Search products..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noResults}>No products found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 45,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  image: { width: 50, height: 50, marginRight: 10 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '500' },
  price: { color: '#666' },
  noResults: { textAlign: 'center', marginTop: 20, color: '#888' },
});
