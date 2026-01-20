import { StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../providers/auth-provider";
import { useOrderUpdateSubscription } from "../../api/subscriptions";
/* make reusable customezation f for icons n style tabsBar */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} {...props} style={{ color: "#1BC464" }} />;
}

const TabsLayout = () => {
  useOrderUpdateSubscription()
  /* const { session, mounting } = useAuth();
  
     if (mounting) return <ActivityIndicator />;
    if (!session) return <Redirect href='/auth' />;  */

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1BC464",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          /* call reusable customezation f for icons on index page of style tabsBar and name of icon is shopping-cart */
          options={{
            title: "shop",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="shopping-cart" />;

            },
          }}
        />
        <Tabs.Screen name="orders"
          /* call reusable customezation f for icons on orders page of style tabsBar  and name of icon is book */
          options={{
            title: "order",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="book" />;

            },

          }} />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  /* to pring tabsbar down */

  safeArea: {
    flex: 1,
  },
});
