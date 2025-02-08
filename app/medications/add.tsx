import {
  Dimensions,
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

const width = Dimensions.get("window").width;
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
      <View style={styles.optionsGrid}>
        {FREQUENCIES.map((freq) => (
          <TouchableOpacity key={freq.id} style={[styles.optionsCard]}>
            <View style={[styles.optionIcon]}>
              <Ionicons name={freq.icon} size={24} color={"black"} />
            </View>{" "}
            <Text style={styles.optionLabel}> {freq.label} </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const renderDurationOptions = () => {
    return (
      <View style={styles.optionsGrid}>
        {DURATIONS.map((duration) => (
          <TouchableOpacity key={duration.id} style={[styles.optionsCard]}>
            <View style={styles.optionIcon}>
              <Text style={[styles.durationNumber]}>
                {" "}
                {duration.value > 0 ? duration.value : "∞"}
              </Text>
              <Text style={[styles.optionLabel]}>{duration.label}</Text>
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
                style={[
                  styles.inputContainer && errors.name && styles.inputError,
                ]}
                placeholder="add your medicine here..."
                placeholderTextColor={"#999"}
              />
            </View>
            <View>
              <TextInput
                style={[styles.mainInput, errors.name && styles.inputError]}
                placeholder="Dosage (e.g. 500mg)"
                placeholderTextColor={"#999"}
              />
            </View>
            <View>
              <TextInput
                style={[styles.mainInput, errors.name && styles.inputError]}
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
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="notifications" size={20} color="#1a8e2d" />
                  </View>
                  <View>
                    <Text style={styles.switchLabel}>Reminders</Text>
                    <Text style={styles.switchSubLabel}>
                      Get notified when it's time to take your medication
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: "#ddd", true: "#1a8e2d" }}
                  thumbColor="white"
                />
              </View>
            </View>
          </View>
          {/* Refill Tracking */}
          {/* notes  */}
          <View style={styles.section}>
            <View style={[styles.textAreaContainer]}>
              <TextInput
                style={[styles.textArea]}
                placeholder="add notes or special instruction..."
                placeholderTextColor={"#999"}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
          style={[styles.saveButton]}
          >
            <LinearGradient
              colors={["#1a8e2d", "#146922"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>{isSubmitting ? "Adding..." : "Add Medication"}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancal</Text>
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
  formContainer: {},
  formContentContainer: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1a1a1a",
    opacity: 0.9,
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1a8e2d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 5,
  },

  mainInput: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    padding: 15,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  optionsCard: {
    width: (width - 72) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    margin: 5,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a8e2d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 5,
  },
  selectedOptionCard: { backgroundColor: "#1a8e2d", borderColor: "#1a8e2d" },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  durationNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a8e2d",
    marginBottom: 5,
  },
  dateContainer: {},
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginRight: 5,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "200",
    color: "#333",
  },
  timesContainer: {},
  timesTitle: {},
  timeButton: {},
  timeIconContainer: {},
  timeButtonText: {},
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  switchLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 10,
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
  switchLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    opacity: 0.9,
  },
  switchSubLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1a1a1a",
    opacity: 0.9,
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  flex1: { flex: 1 },
  input: { padding: 15, fontSize: 16, color: "#333" },
  textAreaContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textArea: {
    height: 100,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",

  },
  saveButtonGradient:{
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",

  },
  cancelButtonText: {
    color: "#667",
    fontSize: 16,
    fontWeight: "600",
  },
  inputError: {},
  errorText: { color: "#f44336", fontSize: 13, marginTop: 5, marginLeft: 10 },
});
