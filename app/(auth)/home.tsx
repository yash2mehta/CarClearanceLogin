import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebaseConfig"; // Ensure you are importing the correct Firebase config

const Page = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // ✅ Await the sign-out process
      Alert.alert("Signed Out", "You have been signed out successfully.");
      router.replace("/(auth)/LandingScreen"); // ✅ Redirect to login after logout
    } catch (error) {
      console.error("❌ Sign Out Error:", error);
      Alert.alert("Sign Out Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Welcome back, {user?.email || "User"}!
      </Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Page;