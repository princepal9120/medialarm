import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

const FREQUENCIES = [
  {
    id: "1",
    label: "Once daily",
    icon: "sunny-outline" as const,
    times: ["09:00"],
  },
  {
    id: "2",
    label: "Twice daily",
    icon: "sync-outline" as const,
    times: ["09:00", "21:00"],
  },
  {
    id: "3",
    label: "Three times daily",
    icon: "time-outline" as const,
    times: ["09:00", "15:00", "21:00"],
  },
  {
    id: "4",
    label: "Four times daily",
    icon: "repeat-outline" as const,
    times: ["09:00", "13:00", "17:00", "21:00"],
  },
  { id: "5", label: "As needed", icon: "calendar-outline" as const, times: [] },
];
const DURATIONS = [
  { id: "1", label: "7 days", value: 7 },
  { id: "2", label: "14 days", value: 14 },
  { id: "3", label: "30 days", value: 30 },
  { id: "4", label: "90 days", value: 90 },
  { id: "5", label: "Ongoing", value: -1 },
];

const AddMedicationScreen = () => {
  const [from, setFrom] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    startDate: new Date(),
    times: ["09:00"],
    notes: "",
    reminderEnabled: true,
    refillReminder: false,
    currentSupply: "",
    refillAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const renderFrequencyOptions = () => {
    return (
      <View>
        {FREQUENCIES.map((freq) => (
          <TouchableOpacity key={freq.id}>
            <View>
              <Ionicons name={freq.icon} size={24} color={"black"} />
              <Text> {freq.label} </Text>
              <Text> {freq.times}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const renderDurationOptions = () => {
    return (
      <View>
        {DURATIONS.map((duration) => (
          <TouchableOpacity key={duration.id}>
            <View>
              <Text> {duration.value > 0 ? duration.value : "∞"}</Text>
              <Text>{duration.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a8e2d", "#146922"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={"#1a8e2d"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Medication</Text>
        </View>
        {/* scrollview */}
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* basic informations */}
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <TextInput
              style={[styles.inputContainer && errors.name && styles.inputError]}
                placeholder="add your medicine here..."
                placeholderTextColor={"#999"}
              />
            </View>
            <View>
              <TextInput
                placeholder="Dosage (e.g. 500mg)"
                placeholderTextColor={"#999"}
              />
            </View>
            <View>
              <TextInput
                placeholder="Dosage (e.g. 500mg)"
                placeholderTextColor={"#999"}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How often?</Text>
              {renderFrequencyOptions()}

              <Text style={styles.sectionTitle}>For How long?</Text>
              {/* render duration options */}
              {renderDurationOptions()}

              <TouchableOpacity style={styles.dateButton}>
                <View style={styles.dateIconContainer}>
                  <Ionicons
                    name="calendar-number"
                    size={20}
                    color={"#1a8e2d"}
                  />
                </View>
                <Text> Start: {}</Text>
              </TouchableOpacity>
              <DateTimePicker value={from.startDate} mode="date" />
              <Text>time</Text>
              <DateTimePicker
                mode="time"
                value={(() => {
                  const [hours, minutes] = from.times[0].split(":").map(Number);
                  const date = new Date();
                  date.setHours(hours, minutes, 0, 0);
                  return date;
                })()}
              />
            </View>
          </View>
          {/* Reminder  */}
          <View>
            <View>
              <View>
                <View>
                  <Ionicons name="notifications" size={23} color={"#1a8e2d"} />
                </View>
                <View>
                  <Text>Reminders</Text>
                  <Text>Get notified when its time to take your medicine</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: "#ddd", true: "#1a8e3d" }}
                thumbColor={"white"}
              />
            </View>
          </View>
          {/* Refill Tracking */}
          {/* notes  */}
          <View>
            <View>
              <TextInput
                placeholder="add notes or special instruction..."
                placeholderTextColor={"#999"}
              />
            </View>
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity>
            <LinearGradient
              colors={["#1a8e2d", "#146922"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text>{isSubmitting ? "Adding..." : "Add Medication"}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Cancal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddMedicationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    position: "absolute",
   
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 120 : 100,
  },
  content: {
    flex: 1,
    padding: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginLeft: 15,
  },
  formContainer: { flex: 1 },
  formContentContainer: { padding: 20,},
  section: { marginBottom: 25,},
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1a1a1a",
    opacity: 0.9,
    marginTop: 10,
  },
  inputContainer: {},
 
  mainInput: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    padding: 15,
  },
  optionsGrid: {},
  dateButton: {},
  dateIconContainer: {},
});
