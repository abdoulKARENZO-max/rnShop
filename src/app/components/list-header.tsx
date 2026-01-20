import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Redirect, router } from "expo-router";

import { useCartStore } from "../../store/cart-store";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/auth-provider";
import { Tables } from "../../types/supabase.types";
import { Category } from "../../../assets/types/category";

export const ListHeader = ({categories}:{categories:Tables<'category'>[]}) => {
  /* const { session, mounting } = useAuth(); */
  const { getItemCount } = useCartStore();

  /* Fixed signout function */
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        // Redirect to auth page after successful sign out
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  /* // If no session, redirect to auth page
  if (!session) {
    return <Redirect href="/auth" />;
  }
 */
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        {/* User Avatar & Greeting */}
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatarImage}
            />
            <Text style={styles.avatarText}>Hello Abdoul KARENZO</Text>
          </View>
        </View>
        
        {/* Shopping Cart Button */}
        <View style={styles.headerRight}>
          <Link style={styles.cartContainer} href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <View>
                  <FontAwesome
                    name="shopping-cart"
                    size={25}
                    color="gray"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{getItemCount()}</Text>
                  </View>
                </View>
              )}
            </Pressable>
          </Link>
          
          {/* Sign Out Button - redirects only when pressed */}
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <FontAwesome name="sign-out" size={25} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* The heroImage */}
      <View style={styles.heroContainer}>
        <Image
          source={require("../../../assets/images/hero.png")}
          style={styles.heroImage}
        />
      </View>
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <Link asChild href={`/categories/${item.slug}`}>
              <Pressable style={styles.category}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryText}>{item.name}</Text>
              </Pressable>
            </Link>
          )}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    gap: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
  },
  cartContainer: {
    padding: 10,
  },
  signOutButton: {
    padding: 10,
  },
  heroContainer: {
    width: "100%",
    height: 200,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  categoriesContainer: {},
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    width: 100,
    alignItems: "center",
    marginBottom: 16,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryText: {},
  badgeContainer: {
    position: "absolute",
    top: -5,
    right: 10,
    backgroundColor: "#1BC464",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
export default ListHeader

