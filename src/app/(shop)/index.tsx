import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ProductListItem } from "../components/product-list-item";
import { ListHeader } from "../components/list-header";
import Auth from "../auth";
import { useAuth } from "../../providers/auth-provider";
import { getProductsAndCategories } from '../../api/api';

const Home = () => {
  const { data, error, isLoading } = getProductsAndCategories();
  
    if (isLoading) return <ActivityIndicator />;
  
    if (error || !data)
      return <Text>Error {error?.message || 'An error occured'}</Text>;
  
  const Container = Platform.OS === "web" ?   ScrollView  : SafeAreaView;

  return (
    <Container style={styles.container}>
      
      <FlatList
        data={data.products}
        renderItem={({ item }) => (
          <View>
            <ProductListItem product={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={<ListHeader categories={data.categories} />}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumn}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
        
      />
    </Container> 
  );
};

export default Home;

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  flatListColumn: {
    justifyContent: "space-between",
  }, 
})

