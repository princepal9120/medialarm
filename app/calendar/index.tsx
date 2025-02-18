import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  DoseHistory,
  getDoseHistory,
  getMedications,
  Medication,
  recordDose,
} from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { JsxAST } from "react-native-svg";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [medications, setMedications] = React.useState<Medication[]>([]);
  const [doseHistory, setDoseHistory] = React.useState<DoseHistory[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [meds, history] = await Promise.all([
        getMedications(),
        getDoseHistory(),
      ]);
      setMedications(meds);
      setDoseHistory(history);
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);

  const renderCalendar = () => {
    const calendar: JSX.Element[] = [];
    let week: JSX.Element[] = [];
    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-${i}`} style={styles.calanderDay} />);
    }
    // add days of the month
    for (let day = 1; day <= days; day++) {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth()
      );
      const isToday = new Date().toDateString() === date.toDateString();
      const hasDoses = doseHistory.some(
        (dose) =>
          new Date(dose.timeStamp).toDateString() === date.toDateString()
      );

      week.push(
        <TouchableOpacity
          key={day}
          onPress={() => setSelectedDate(date)}
          style={[
            styles.calanderDay,
            isToday && styles.today,
            hasDoses && styles.hasEvents,
          ]}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>
            {day}
          </Text>
          {hasDoses && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );

      if ((firstDay + day) % 7 === 0 || day === days) {
        calendar.push(
          <View key={day} style={styles.calanderWeek}>
            {week}
          </View>
        );
        week = [];
      }
    }

    return calendar;
  };
  const renderMedicationsForDate = () => {
    const datestr = selectedDate.toDateString();
    const dayDoses = doseHistory.filter(
      (dose) => new Date(dose.timeStamp).toDateString() === datestr
    );

    return medications.map((medications) => {
      const taken = dayDoses.some(
        (dose) => dose.medicationId === medications.id && dose.taken
      );

      return (
        <View key={medications.id} style={styles.medicationCard}>
          <View
            style={[
              styles.medicationColor,
              {
                backgroundColor: medications.color,
              },
            ]}
          />
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>{medications.name}</Text>
              <Text style={styles.medicationDosage}>{medications.dosage}</Text>
              <Text style={styles.medicationTime}>{medications.times[0]}</Text>
            </View>
            {taken ? (
              <View style={styles.takenBadge}>
                <Ionicons name="checkmark-circle" size={20} color={"#4caf50"} />
                <Text style={styles.takenText}>Taken</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.takeDoseButton,
                  { backgroundColor: medications.color },
                ]}
                onPress={async () => {
                  await recordDose(
                    medications.id,
                    true,
                    new Date().toISOString()
                  );
                  loadData();
                }}
              >
                <Text style={styles.takeDoseButton}>Take</Text>
              </TouchableOpacity>
            )}
          </View>

      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <LinearGradient
        colors={["#1A8E2D", "#146922"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1A8E2D" />
          </TouchableOpacity>{" "}
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() - 1,
                    1
                  )
                )
              }
            >
              <Ionicons name="chevron-back" size={24} color="#1A8E2D" />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {selectedDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() + 1,
                    1
                  )
                )
              }
            >
              <Ionicons name="chevron-forward" size={24} color="#1A8E2D" />
            </TouchableOpacity>
          </View>
          <View style={styles.weekdayHeader}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>
          {renderCalendar()}
        </View>
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>
            {selectedDate.toLocaleString("default", {
              weekday: "long",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderMedicationsForDate()}
          </ScrollView>
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
    paddingBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
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

  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    color: "#666",
    fontWeight: "500",
  },
  calanderDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  calanderWeek: {
    flexDirection: "row",
    marginBottom: 5,
  },
  today: {
    backgroundColor: "1a8e2d15",
  },
  hasEvents: {
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  todayText: {
    color: "1a8e2d",
    fontWeight: "600",
  },

  scheduleContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  medicationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 2,
  },
  medicationColor: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 15,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 2,
  },
  medicationTime: {
    fontSize: 14,
    color: "#666",
  },
  takenBadge: {
    flexDirection: "row",
    alignItems:"center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical:6,
    borderRadius:12,

  },
  takenText: {
    color: "#4caf50",
    fontWeight: "600",
    fontSize: 14,
    borderRadius: 12,

  },
  takeDoseButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  takeDoseText: {
    flexDirection: "row",
    alignContent: "center",
    backgroundColor: "#E8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderStartEndRadius: 12,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1A8E2D",
    position: "absolute",
    bottom: "15%",
  },
});
