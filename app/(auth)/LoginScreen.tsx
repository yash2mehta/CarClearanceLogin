import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Dimensions, Alert, ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "@react-native-google-signin/google-signin";
import authFirebase from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "896901715663-potelc1ifrp6iofon66emrh3lt3j46hd.apps.googleusercontent.com",
      offlineAccess: true
    });
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        router.push("/(auth)/home");
      }
    } catch (err) {
      Alert.alert("Login Failed", "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <View style={styles.container}>
      {/* Form Inputs */}
      <View style={styles.formContainer}>
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

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#A0A0A0"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPasswordScreen")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Login Button */}
        <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or Sign In With</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Sign-In Button */}
        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />

        {/* Sign Up Link */}
        <TouchableOpacity onPress={() => router.push("/(auth)/SignUpScreen")}>
          <Text style={styles.signUpText}>
            Don’t have an account yet? <Text style={styles.signUp}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: width * 0.05, 
    backgroundColor: "#fff" 
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: height * 0.15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
  },
  input: {
    height: 45,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  forgot: {
    color: "#8A2BE2",
    textAlign: "right",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingBottom: height * 0.05,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#A0A0A0",
  },
  orText: {
    marginHorizontal: 8,
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  googleButton: {
    alignSelf: "center",
  },
  signUpText: {
    textAlign: "center",
    fontSize: 14,
    color: "#000",
  },
  signUp: {
    color: "#8A2BE2",
    fontWeight: "bold",
  },
});

export default LoginScreen;