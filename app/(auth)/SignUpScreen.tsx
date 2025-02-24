import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Dimensions, Alert, ActivityIndicator, 
  KeyboardAvoidingView, ScrollView, Platform
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebaseConfig";
import { 
  createUserWithEmailAndPassword, sendEmailVerification 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "@react-native-google-signin/google-signin";
import authFirebase from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

const SignUpScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "896901715663-potelc1ifrp6iofon66emrh3lt3j46hd.apps.googleusercontent.com",
      offlineAccess: true
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken || signInResult.idToken;
      if (!idToken) throw new Error("Google Sign-In failed: No ID token returned.");

      const googleCredential = authFirebase.GoogleAuthProvider.credential(idToken);
      const userCredential = await authFirebase().signInWithCredential(googleCredential);
      const user = userCredential.user;

      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("Success", "Signed in with Google!");
      router.push("/(auth)/home");

    } catch (error) {
      console.error("Google Sign-In Error:", error);
      if (error && typeof error === "object" && "code" in error) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Cancelled", "Google Sign-In was cancelled.");
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("Error", "Google Sign-In is already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Google Play Services are not available.");
            break;
          default:
            Alert.alert("Error", `Google Sign-In failed: ${error.message}`);
        }
      } else {
        Alert.alert("Error", "Unknown error: Something went wrong.");
      }
    }
  };

  const handleSignUp = async () => {
    if (!email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem("emailForSignUp", email);
      await sendEmailVerification(user);

      Alert.alert("Success", "Check your email to verify your account.");
      router.push("/(auth)/EmailVerificationScreen");

    } catch (error) {
      console.error("❌ Sign-Up Error:", error);
      Alert.alert("Sign Up Failed", error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. hello@email.com" 
            value={email} 
            onChangeText={setEmail} 
          />

          <Text style={styles.label}>Phone Number:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="+65 9XXX XXXX" 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad" 
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={true} 
          />

          <Text style={styles.label}>Retype Password:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            secureTextEntry={true} 
          />

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>

        {/* Bottom Section (Divider + Google Button + Login Link) */}
        <View style={styles.bottomContainer}>
          <View style={styles.spacing} />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.spacing} />

          {/* Google Sign-In Button */}
          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
          />

          <View style={styles.spacing} />

          {/* Log In Link */}
          <TouchableOpacity onPress={() => router.push("/(auth)/LoginScreen")}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingHorizontal: width * 0.05 },
  formContainer: { width: "100%", marginTop: height * 0.1 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#000" },
  input: { height: 45, backgroundColor: "#F2F2F2", borderRadius: 10, paddingHorizontal: 12, fontSize: 14, marginBottom: 15 },
  button: { backgroundColor: "#8A2BE2", paddingVertical: 14, alignItems: "center", borderRadius: 10, elevation: 3, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  bottomContainer: { alignItems: "center", paddingBottom: height * 0.05 },
  spacing: { height: height * 0.03 },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  divider: { flex: 1, height: 1, backgroundColor: "#A0A0A0" },
  dividerText: { marginHorizontal: 8, color: "#000", fontSize: 14, fontWeight: "500" },
  googleButton: { alignSelf: "center" },
  loginText: { textAlign: "center", fontSize: 14, color: "#000" },
  loginLink: { color: "#8A2BE2", fontWeight: "bold" }
});

export default SignUpScreen;