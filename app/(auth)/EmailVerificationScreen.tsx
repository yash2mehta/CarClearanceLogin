import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, TouchableOpacity, Alert, StyleSheet 
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebaseConfig"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmailVerificationScreen = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  // ✅ Polling for email verification every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          console.log("✅ Email Verified:", user.email);
          await AsyncStorage.removeItem("emailForSignUp");
          Alert.alert("Success", "Your email has been verified!");
          router.push("/home"); // Navigate to home page
          clearInterval(interval);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Manual Check for Verification
  const checkVerificationStatus = async () => {
    setIsChecking(true);
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        console.log("✅ Email Verified:", user.email);
        await AsyncStorage.removeItem("emailForSignUp");
        Alert.alert("Success", "Your email has been verified!");
        router.push("/home");
      } else {
        Alert.alert("Not Verified", "Please verify your email and try again.");
      }
    }
    setIsChecking(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Waiting for Email Verification</Text>

      <View style={styles.content}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.infoText}>
          We have sent a verification email. Please check your inbox and click the link to verify your account.
        </Text>
        <Text style={styles.infoText}>
          This page will automatically refresh once your email is verified.
        </Text>

        {/* Manual Verification Button */}
        <TouchableOpacity style={styles.checkButton} onPress={checkVerificationStatus} disabled={isChecking}>
          {isChecking ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkButtonText}>Check Verification</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    justifyContent: "center", 
    alignItems: "center", 
    paddingHorizontal: 20 
  },
  header: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#8A2BE2", 
    marginBottom: 20 
  },
  content: { 
    alignItems: "center", 
    paddingHorizontal: 20 
  },
  infoText: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#555", 
    marginVertical: 10 
  },
  checkButton: { 
    backgroundColor: "#FFA500", 
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    marginTop: 20, 
    alignItems: "center", 
    width: "100%", 
    maxWidth: 300 
  },
  checkButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});

export default EmailVerificationScreen;