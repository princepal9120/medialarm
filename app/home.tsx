import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef } from "react";
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
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeContainer}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#1A8E2D",
  },
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
    top: -4,
    right: -4,
    backgroundColor: "#ff5252",
    borderRadius: 10,
    height: 30,
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
    fontSize: 20  ,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1a1a1a",
    opacity: 0.9,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 15,
  },
  actionButton: {
    width: (width - 52) / 2,
    height : 100,
    borderRadius: 15,
    overflow: "hidden",
  },
  actionGradient: {
    flex: 1,
    padding:15
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
    marginTop: 8,
  },
});
