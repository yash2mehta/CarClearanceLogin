// ✅ Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdFChl7ish1r14jc2IIIFRKuceWZv-_k0",
  authDomain: "carclearanceapp.firebaseapp.com",
  projectId: "carclearanceapp",
  storageBucket: "carclearanceapp.firebasestorage.app", 
  messagingSenderId: "896901715663",
  appId: "1:896901715663:web:90075aaaa6fc667f20c9ba",
  measurementId: "G-NDL8FB7LRV",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);  // 🔥 Ensuring Functions are Initialized
const analytics = getAnalytics(app);

// ✅ Configure Firebase Functions Emulator (FOR LOCAL TESTING ONLY)
// connectFunctionsEmulator(functions, "localhost", 5001);

// ✅ Configure Google Sign-In
GoogleSignin.configure({
  webClientId: "896901715663-1fcuc2f70k7mb0qa8o6cqllasnp3f7tq.apps.googleusercontent.com",
  offlineAccess: true, // Enables refresh tokens
});

// ✅ Set Google Provider Parameters
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// ✅ Updated Action Code Settings (Without Dynamic Links)
export const actionCodeSettings = {
  url: "carclearanceapp.firebaseapp.com",
  handleCodeInApp: true,
  iOS: {
    bundleId: "com.CarClearanceApp.CarClearanceApp",
  },
  android: {
    packageName: "com.CarClearanceApp.CarClearanceApp",
    installApp: true,
    minimumVersion: "12",
  },
};

// ✅ Set Firebase Authentication Language to Device Default
auth.useDeviceLanguage();

// ✅ Export Firebase Modules
export { app, auth, googleProvider, functions, analytics };
