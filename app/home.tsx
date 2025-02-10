import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number;
  totleDoses: number;
  completedDoses: number;
}
const QUICK_ACTIONS = [
  {
    icon: "add-circle-outline" as const,
    label: "Add\nMedication",
    route: "/medications/add" as const,
    color: "#2E7D32",
    gradient: ["#4CAF50", "#2E7D32"] as [string, string],
  },
  {
    icon: "calendar-outline" as const,
    label: "Calendar\nView",
    route: "/calendar" as const,
    color: "#1976D2",
    gradient: ["#2196F3", "#1976D2"] as [string, string],
  },
  {
    icon: "time-outline" as const,
    label: "History\nLog",
    route: "/history" as const,
    color: "#C2185B",
    gradient: ["#E91E63", "#C2185B"] as [string, string],
  },
  {
    icon: "medical-outline" as const,
    label: "Refill\nTracker",
    route: "/refills" as const,
    color: "#E64A19",
    gradient: ["#FF5722", "#E64A19"] as [string, string],
  },
];

function CircularProgress({
  progress,
  totleDoses,
  completedDoses,
}: CircularProgressProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const size = width * 0.55;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const cirumferance = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);
  const strokDashOffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [cirumferance, 0],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressPercentage}> {Math.round(progress)}%</Text>
        <Text style={styles.progressLabel}>
          {completedDoses} of {totleDoses} doses
        </Text>
      </View>
      <Svg width={size} height={size} style={styles.progressRing}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={cirumferance}
          strokeDashoffset={strokDashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

const HomeScreen = () => {
  const [showNotifications, setShowNotifications] = useState(true);
  const router = useRouter();
  return (
    // <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <LinearGradient colors={["#1A8E2D", "#146922"]} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}> Daily Progress</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={"white"}
                />
                {
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>1</Text>
                  </View>
                }
              </TouchableOpacity>
            </View>
            <CircularProgress progress={50} totleDoses={8} completedDoses={5} />
          </View>
        </LinearGradient>
        <View style={styles.content}>
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {QUICK_ACTIONS.map((action) => (
                <Link href={action.route} key={action.label} asChild>
                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={action.gradient}
                      style={styles.actionGradient}
                    >
                      <View style={styles.actionContent}>
                        <View style={styles.actionIcon}>
                          <Ionicons
                            name={action.icon}
                            size={28}
                            color="white"
                          />
                        </View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <Link rel="stylesheet" href="/calendar">
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {true ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color={"#ccc"} />
              <Text style={styles.emptyStateText}>
                No medication Scheduled Today
              </Text>
              <Link href={"/medications/add"}>
                <TouchableOpacity style={styles.addMedicationButton}>
                  <Text style={styles.addMedicationButtonText}>
                    Add Mediation
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            [].map((medication) => (
              <View style={styles.doseCard}>
                <View
                  style={[
                    styles.doseBadge,
                    {
                      // backgroundColor: medication.color
                    },
                  ]}
                >
                  <Ionicons
                    name="medical-sharp"
                    size={24}
                    color={"#ccd6f6"}
                  />
                  <Text>time</Text>
                </View>
                <View style={styles.doseInfo}>
                  <View>
                    <Text style={styles.medicineName}> name</Text>
                    <Text style={styles.dosageInfo}>dosage</Text>
                  </View>
                  <View style={styles.doseTime}>
                    <Ionicons name="time-outline" size={24} color={"#ccd6f6"} />
                    <Text>time</Text>
                  </View>
                </View>
                {true ? (
                  <View style={styles.takenBadge}>
                    <Ionicons name="checkmark-circle-outline" size={24} />
                    <Text style={styles.takenText}>taken</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.takeDoseButton,
                      {
                        backgroundColor: "#d32e9c",
                      },
                    ]}
                  >
                    <Text style={styles.takeDoseText}>take</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
        <Modal
          visible={showNotifications}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNotifications(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity
                  onPress={() => setShowNotifications(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              {[].map((medication) => (
                <View style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Ionicons name="medical-sharp" size={24} color="#ccc" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>name</Text>
                    <Text style={styles.notificationMessage}>dosage</Text>
                    <Text style={styles.notificationTime}>time</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
    // </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingBottom: 50,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    // paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "white",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  notificationButton: {
    position: "relative",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
  },
  notificationBadge: {
    position: "absolute",
    top: -0.9,
    right: -0.9,
    backgroundColor: "#ff5252",
    borderRadius: 60,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1,
    minWidth: 20,
    borderColor: "#146922",
  },
  notificationCount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  progressTextContainer: {
    position: "absolute",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 32,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 11,
    color: "white",
    fontWeight: "bold",
  },
  progressRing: {
    transform: [{ rotate: "-90deg" }],
  },
  progressDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressDetailsText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1a1a1a",
    opacity: 0.9,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    width: (width - 52) / 2,
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
  },
  actionGradient: {
    flex: 1,
    padding: 15,
  },
  actionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeAllButton: {
    fontSize: 14,
    color: "#2e7d32",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addMedicationButton: {
    backgroundColor: "#1a8e2d",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addMedicationButtonText: {
    color: "white",
    fontWeight: "600",
  },
  doseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doseBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  doseInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dosageInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  doseTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  takeDoseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginLeft: 10,
  },
  takeDoseText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },

  takenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10,
  },
  takenText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
});
