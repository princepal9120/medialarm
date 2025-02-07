import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const AuthScreen = () => {
  const [hasBiometrics, setHasBiometrics] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [error, setError] = useState(false);
  return (
    <LinearGradient
      colors={["#4CAF50", "#2E7D32"]}
      style={styles.mainContainer}
    >
      <View style={styles.content}>
        <View>
          <Ionicons name="medical" size={80} color={"white"} />
        </View>
        <Text>MediAlert</Text>
        <Text>Your Personal Medical Alert App</Text>
        <View>
          <Text>Welcome Back</Text>
          <Text>
            {hasBiometrics
              ? "use faceId/touchId Or PIN to access your medications"
              : "Enter your pin to access to medications"}
          </Text>
          <TouchableOpacity>
            <Ionicons
              name={hasBiometrics ? "finger-print-outline" : "key-outline"}
              size={40}
              color={"white"}
            />
            <Text style={styles.text}>
              {" "}
              {isAuthenticated
                ? "Vefify..."
                : hasBiometrics
                ? "authenticate"
                : "Enter your pin"}
            </Text>
          </TouchableOpacity>
          {error && (
            <View>
              <Ionicons
                name="alert-circle"
                size={20}
                color={"#f44336"}
              ></Ionicons>
              <Text style={styles.text}>{error}</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
