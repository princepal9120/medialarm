import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const AuthScreen = () => {
  const [hasBiometrics, setHasBiometrics] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [error, setError] = useState< string| null>(null);
  const router =useRouter()
  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(hasHardware && isEnrolled);
  };
  const authenticate = async () => {
    try {
      setIsAuthenticated(true);
      setError(null);
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage:
          hasHardware && isEnrolled
            ? "use faceId/touchId"
            : "Enter your pin to access to medications",
        fallbackLabel: "Use pin",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,

      });
      if(auth.success){
        router.replace("/home")
      }else{
        setError("Authentication failed: Plese try again.")
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkBiometrics();
  }, []);
  return (
    <LinearGradient
      colors={["#4CAF50", "#2E7D32"]}
      style={styles.mainContainer}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={80} color={"white"} />
        </View>
        <Text style={styles.title}>MediAlert</Text>
        <Text style={styles.subtitle}>Your Personal Medical Alert App</Text>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.instructionText}>
            {hasBiometrics
              ? "use faceId/touchId Or PIN to access your medications"
              : "Enter your pin to access to medications"}
          </Text>
          <TouchableOpacity
            style={[styles.button, isAuthenticated && styles.buttonDisabled]}
            onPress={authenticate}
            disabled={isAuthenticated}
          >
            <Ionicons
              name={hasBiometrics ? "finger-print-outline" : "keypad-outline"}
              size={40}
              color={"white"}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {" "}
              {isAuthenticated
                ? "Vefify..."
                : hasBiometrics
                ? "authenticate"
                : "Enter your pin"}
            </Text>
          </TouchableOpacity>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={"#f44336"}
              ></Ionicons>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 2,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#4CAF50",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 40,
    textShadowColor: "rgba(205, 205, 205, 0.9)",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    marginBottom: 20,
    shadowColor: "black",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
    color: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginLeft: 8,
  },
});
