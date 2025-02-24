import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { functions } from "@/lib/firebaseConfig";
import { httpsCallable } from "firebase/functions";

const { width, height } = Dimensions.get("window");

const OTPScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(""); // ✅ OTP is now a string
  const [loading, setLoading] = useState(false);

  // ✅ Handle OTP Input (User enters 6-digit OTP)
  const handleOTPChange = (value: string) => {
    if (value.length <= 6) setOtp(value);
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const verifyOTP = httpsCallable(functions, "verifyEmailOTP");
      const result = await verifyOTP({ email, otp });

      if (result.data.success) {
        Alert.alert("Success", "Your email has been verified!");
        router.push("/(auth)/home"); // ✅ Redirect to Home
      } else {
        Alert.alert("Error", "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOTP = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const sendEmailOTP = httpsCallable(functions, "sendEmailOTP");
      await sendEmailOTP({ email });
      Alert.alert("Success", "A new OTP has been sent to your email.");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* OTP Header Text */}
      <Text style={styles.header}>We have sent you an OTP via your email</Text>

      {/* OTP Input Box */}
      <TextInput
        style={styles.otpInput}
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={handleOTPChange}
      />

      {/* Resend & Edit Email Options */}
      <View style={styles.optionContainer}>
        <TouchableOpacity onPress={() => router.push("/(auth)/SignUpScreen")}>
          <Text style={styles.optionText}>
            Key-ed in the wrong email? <Text style={styles.optionLink}>Edit Email</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResendOTP}>
          <Text style={styles.optionText}>
            Didn't receive OTP? <Text style={styles.optionLink}>Send Again</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Verifying..." : "Submit"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
    marginBottom: height * 0.02,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#A0A0A0",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 8,
    letterSpacing: 8,
    marginBottom: height * 0.04,
  },
  optionContainer: {
    alignItems: "left",
    marginBottom: height * 0.05,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  optionLink: {
    color: "#8A2BE2",
    fontWeight: "bold",
  },
  bottomContainer: {
    justifyContent: "flex-end",
    paddingBottom: height * 0.05,
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OTPScreen;