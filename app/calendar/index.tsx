import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CalendarScreen = () => {
  return (
    <View style={{ flex: 1 ,backgroundColor: '#f8f9fa'}}>
      <LinearGradient
        colors={["#1A8E2D", "#146922"]}
        style={styles.headerGradient}
      />
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#1A8E2D" />
            </TouchableOpacity>{" "}
            <Text style={styles.headerTitle}>Calendar</Text>
          </View>

          
        </View>
      
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  headerGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: Platform.OS === "ios" ? 120 : 100,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",

    gap: 20,
    alignItems: "center",

    paddingBottom: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    color: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 5,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
});
