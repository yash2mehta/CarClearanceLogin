import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window'); // Get screen width & height

const LandingScreen = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'SFUIDisplay-Bold': require('../../assets/fonts/SFUIDisplay-Bold.ttf'),
    'SFUIDisplay-Regular': require('../../assets/fonts/SFUIDisplay-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Prevent rendering before fonts are loaded
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient colors={['#8A2BE2', '#B482FF']} style={styles.hero}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { fontFamily: 'SFUIDisplay-Bold' }]}>Car Clearance</Text>
          <Text style={[styles.subtitle, { fontFamily: 'SFUIDisplay-Regular' }]}>Mobile App</Text>
        </View>
      </LinearGradient>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/LoginScreen')}>
        <Text style={[styles.buttonText, { fontFamily: 'SFUIDisplay-Bold' }]}>Login</Text>
      </TouchableOpacity>

      {/* Sign-up Link */}
      <TouchableOpacity onPress={() => router.push('/(auth)/SignUpScreen')}>
        <Text style={[styles.link, { fontFamily: 'SFUIDisplay-Regular' }]}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  hero: {
    position: 'absolute', // Forces gradient to start at the top
    top: 0, // No extra space on top
    left: 0,
    width: '100%',
    height: height * 0.718, // 71.8% of screen height
    borderBottomLeftRadius: width * 0.5,
    borderBottomRightRadius: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'column', // Stack text vertically
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    flex: 1, // Ensures full space usage
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginBottom: 40,
    color: '#8A2BE2',
    textDecorationLine: 'underline',
  },
});

export default LandingScreen;
