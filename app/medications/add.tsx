import {
  Alert,
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
import { useRouter } from "expo-router";
import { addMedication } from "@/utils/storage";
import { scheduleMedicationReminder } from "@/utils/notifications";

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
  const router = useRouter();
  const [form, setForm] = useState({
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
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [durationFrequencey, setDuratoinFrequency] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const renderFrequencyOptions = () => {
    return (
      <View style={styles.optionsGrid}>
        {FREQUENCIES.map((freq) => (
          <TouchableOpacity
            key={freq.id}
            style={[
              styles.optionsCard,
              selectedFrequency === freq.label && styles.selectedOptionCard,
            ]}
            onPress={() => {
              setSelectedFrequency(freq.label);
              setForm({ ...form, frequency: freq.label });
            }}
          >
            <View
              style={[
                styles.optionIcon,
                selectedFrequency === freq.label && styles.selectedOptionIcon,
              ]}
            >
              <Ionicons
                name={freq.icon}
                size={24}
                color={selectedFrequency === freq.label ? "white" : "#1a8e2d"}
              />
            </View>{" "}
            <Text
              style={
                (styles.optionLabel,
                selectedFrequency === freq.label && styles.selectedOptionLabel)
              }
            >
              {" "}
              {freq.label}{" "}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const renderDurationOptions = () => {
    return (
      <View style={styles.optionsGrid}>
        {DURATIONS.map((duration) => (
          <TouchableOpacity
            key={duration.id}
            style={[
              styles.optionsCard,
              durationFrequencey === duration.label &&
                styles.selectedOptionCard,
            ]}
            onPress={() => {
              setDuratoinFrequency(duration.label);
              setForm({ ...form, duration: duration.label });
            }}
          >
            <View style={styles.optionIcon}>
              <Text
                style={[
                  styles.durationNumber,
                  durationFrequencey === duration.label && styles.optionLabel,
                ]}
              >
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      newErrors.name = "Medication Name is required";
    }
    if (!form.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }
    if (!form.frequency) {
      newErrors.frequency = "Frequency is required";
    }
    if (!form.duration) {
      newErrors.duration = "Duration is required";
    }
    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!form.times.length) {
      newErrors.times = "Times is required";
    }
    if (form.refillReminder) {
      if (!form.currentSupply) {
        newErrors.currentSupply =
          "Current supply is required for refill tracking";
      }
      if (!form.refillAt) {
        newErrors.refillAt = "Refill at is required";
      }
      if (Number(form.refillAt) >= Number(form.currentSupply)) {
        newErrors.refillAt = "Refill at should be less than current supply";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        Alert.alert("Please fill in all the required fields");
        return;
      }
      if (isSubmitting) return;
      setIsSubmitting(true);

      //generte a random color
      const colors = [
        "#1a8e2d",
        "#146922",
        "#4CAF50",
        "#8BC34A",
        "#C0CA33", // Greens
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722", // Yellows & Oranges
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5", // Reds & Purples
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4E342E", // Blues & Teals
        "#607D8B",
        "#795548",
        "#9E9E9E",
        "#000000",
        "#FFFFFF", // Grays, Browns & Black/White
      ];

      const randomColor = colors[Math.floor(Math.random() * colors.length * 2)];
      const medicatonData = {
        id: Math.random().toString(36).substring(2, 9),
        ...form,
        currentSupply: form.currentSupply ? Number(form.currentSupply) : 0,
        totalSupply: form.currentSupply ? Number(form.currentSupply) : 0,
        refillAt: form.refillAt ? Number(form.refillAt) : 0,
        startDate: form.startDate.toISOString(),
        color: randomColor,
      };
      console.log(medicatonData);
      await addMedication(medicatonData);

      if (medicatonData.reminderEnabled) {
        await scheduleMedicationReminder(medicatonData);
      }

      Alert.alert(
        "Success",
        "Medication added successfully",
        [
          {
            text: "Ok",
            onPress: () => router.back(),
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error) {
      console.error("save error:", error);
      Alert.alert(
        "Error",
        "Failed to add medication.Please try again.",
        [{ text: "ok" }],
        { cancelable: false }
      );
    } finally {
      setIsSubmitting(false);
    }
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
                style={[styles.mainInput, errors.name && styles.inputError]}
                placeholder="add your medicine here..."
                placeholderTextColor={"#999"}
                value={form.name}
                onChangeText={(text) => {
                  setForm({ ...form, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.mainInput, errors.dosage && styles.inputError]}
                placeholder="Dosage (e.g. 500mg)"
                placeholderTextColor={"#999"}
                value={form.dosage}
                onChangeText={(text) => {
                  setForm({ ...form, dosage: text });
                  if (errors.dosage) {
                    setErrors({ ...errors, dosage: "" });
                  }
                }}
              />
              {errors.dosage && (
                <Text style={styles.errorText}>{errors.dosage}</Text>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How often?</Text>
            {errors.frequency && (
              <Text style={styles.errorText}>{errors.frequency}</Text>
            )}
            {renderFrequencyOptions()}

            <Text style={styles.sectionTitle}>For How long?</Text>
            {errors.duration && (
              <Text style={styles.errorText}>{errors.duration}</Text>
            )}
            {/* render duration options */}
            {renderDurationOptions()}

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.dateIconContainer}>
                <Ionicons name="calendar-number" size={20} color={"#1a8e2d"} />
              </View>
              <Text style={styles.dateButtonText}>
                {" "}
                Starts {form.startDate.toLocaleDateString()}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={"#666"} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.startDate}
                mode="date"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  // setShowTimePicker(true);
                  if (date) {
                    setForm({ ...form, startDate: date });
                  }
                }}
              />
            )}

            {form.frequency && form.frequency !== "As needed" && (
              <View style={styles.timesContainer}>
                <Text style={styles.timesTitle}>Meditation Times</Text>

                {form.times.map((time, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <View style={styles.timeIconContainer}>
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={"#1a8e2d"}
                      />
                    </View>
                    <Text style={styles.timeButtonText}> {time}</Text>
                    <Ionicons name="chevron-forward" size={20} color={"#666"} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {showTimePicker && (
              <DateTimePicker
                mode="time"
                value={(() => {
                  const [hours, minutes] = form.times[0].split(":").map(Number);
                  const date = new Date();
                  date.setHours(hours, minutes, 0, 0);
                  return date;
                })()}
                onChange={(event, date) => {
                  setShowTimePicker(false);
                  if (date) {
                    const newTime = date.toLocaleDateString("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                    setForm((prev) => ({
                      ...prev,
                      times: prev.times.map((t, i) => (i === 0 ? newTime : t)),
                    }));
                  }
                }}
              />
            )}
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
                  value={form.reminderEnabled}
                  onValueChange={(value) => {
                    setForm({ ...form, reminderEnabled: value });
                  }}
                  trackColor={{ false: "#ddd", true: "#1a8e2d" }}
                  thumbColor="white"
                  style={styles.switchIcon}
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
                value={form.notes}
                onChangeText={(text) => setForm({ ...form, notes: text })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleSave()}
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={["#1a8e2d", "#146922"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? "Adding..." : "Add Medication"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
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
    gap: 20,
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
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 2,
  },

  mainInput: {
    fontSize: 20,
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
    width: (width - 74) / 2,
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
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
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
  selectedOptionIcon: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedOptionLabel: { color: "white" },
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
    marginTop: 12,
    padding: 15,
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
  timesContainer: { marginTop: 20 },
  timesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  timeButton: {
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
  timeIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginRight: 5,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "200",
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,

    padding: 20,
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
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    opacity: 0.9,
  },
  switchSubLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1a1a1a",
    marginTop: 2,
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
  saveButtonGradient: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
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
  inputError: {
    borderColor: "FF5252",
  },
  errorText: { color: "#f44336", fontSize: 13, marginTop: 5, marginLeft: 10 },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  switchIcon: {
    marginTop: -25,
  },
});
