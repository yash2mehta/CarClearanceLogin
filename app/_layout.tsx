import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/LandingScreen" />
      <Stack.Screen name="(auth)/LoginScreen" />
      <Stack.Screen name="(auth)/SignUpScreen" />
      <Stack.Screen name="(auth)/OTPScreen" />
      <Stack.Screen name="(auth)/ForgotPasswordScreen" />
      <Stack.Screen name="(auth)/EmailVerificationScreen" />
    </Stack>
  );
}
