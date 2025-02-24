import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Dimensions, Alert, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success", 
        "A password reset link has been sent to your email. Please check your inbox."
      );
      router.push("/(auth)/LoginScreen"); // Navigate back to login
    } catch (error) {
      console.error("Password Reset Error:", error);
      Alert.alert("Error", error.message || "An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Enter your email below and we'll send you a password reset link.
        </Text>

        <Text style={styles.label}>Email Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. hello@email.com"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleResetPassword} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/LoginScreen")}>
          <Text style={styles.backToLogin}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  formContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
    width: "100%",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5, // Disabled button when loading
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLogin: {
    color: "#8A2BE2",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;