import { StyleSheet, Text, View, FlatList, Image,ActivityIndicator } from "react-native";
import React from "react";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

import Product from "../product";
import ProductListItem from "../components/product-list-item";
import { getCategoryAndProducts } from '../../api/api';

const Category = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  // we can use that slug to get particular caategory we wont
  //search for category whrere is equal to slug different cateegories
  /* if we do not find category then go not found page  */

  const { data, error, isLoading } = getCategoryAndProducts(slug);
if (isLoading) return <ActivityIndicator />;
if (error || !data) return <Text>Error: {error?.message}</Text>;
if (!data.category || !data.products) return <Redirect href='/404' />;

  const { category, products } = data;

  // get products that belongs to that category
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: category.name }} />
      {/* display pressed category image */}
      <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
      {/* display pressed category name */}
      <Text style={styles.categoryName}>{category.name}</Text>
      {/* list of our products */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  categoryImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productsList: {
    flexGrow: 1,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productContainer: {
    flex: 1,
    margin: 8,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});
