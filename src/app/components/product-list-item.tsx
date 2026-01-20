import { StyleSheet, Pressable, Text, Image, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Tables } from "../../types/supabase.types";
// product means one product
export const ProductListItem = ({ product }: { product: Tables<'product'> }) => {
  return (
    /* the links to go to details item page */

    <Link href={`/product/${product.slug}`} asChild>
      {/*   we use Pressable co since every item image
   will pressable in order to links to item details page */}
      <Pressable style={styles.item}>
        {/*  product image */}
        <Image source={{uri:product.heroImage}} style={styles.itemImage} />

        {/* product title and price */}

        <Text style={styles.itemTitle}>{product.title}</Text>
        <Text style={styles.itemPrice}>${product.price.toFixed(2)}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  itemImage: {
    width: 150,
    height: 150,
    minWidth: 150,
    minHeight: 150,
    maxWidth: 150,
    maxHeight: 150,
    borderRadius: 8,
    resizeMode: "contain",
    alignSelf: "center", // to center the image if needed
  },

  itemTitle: {
    color: "#888",
    fontSize: 18,
    fontWeight: "bold",

    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
export default ProductListItem;
