import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Medication } from "@/utils/storage";
import { useRouter } from "expo-router";

const RefillsScreen = () => {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);

  const getSupplyStatus = (medication: Medication) => {
    const percentage =
      (medication.currentSupply / medication.totalSupply) * 100;
    if (percentage <= medication.refillAt) {
      return {
        status: "Low",
        color: "#F44336",
        backgroundColor: "#FFEBEE",
      };
    } else if (percentage <= 50) {
      return {
        status: "Medium",
        color: "#FF9800",
        backgroundColor: "#FFF3E0",
      };
    } else {
      return {
        status: "Good",
        color: "#4CAF50",
        backgroundColor: "#E8F5E9",
      };
    }
  };

  const handleRefill = (medications: Medication) => {
    Alert.alert("hello");
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a8e2d", "#146922"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color={"#333"} />
          </TouchableOpacity>
          <Text>Refills</Text>
        </View>
        <ScrollView>
          {medications.length == 0 ? (
            <View>
              <Ionicons name="medical-sharp" size={48} color={"#ccc"} />
              <Text> No medications to track the progress</Text>
              <TouchableOpacity onPress={() => router.push("/medications/add")}>
                <Text>Add Medication</Text>
              </TouchableOpacity>
            </View>
          ) : (
            medications.map((medication) => {
              const supplyStatus = getSupplyStatus(medication);
              const supplyPercentage =
                (medication.currentSupply / medication.totalSupply) * 100;

              return (
                <View key={medication.id} style={styles.medicationCard}>
                  <View style={styles.medicationHeader}>
                    <View
                      style={[
                        styles.medicationColor,
                        { backgroundColor: medication.color },
                      ]}
                    />
                    <View>
                      <Text>{medication.name}</Text>
                      <Text>{medication.dosage}</Text>
                    </View>
                    <View>
                      <Text>{supplyStatus.status}</Text>
                    </View>
                  </View>
                  <View style={styles.supplyContinaer}>
                    <View style={styles.supplyInfo}>
                      <Text>Current Supply</Text>
                      <Text>{medication.currentSupply} unit</Text>
                    </View>
                    <View style={styles.pregressBarConainer}>
                      <View style={styles.pregressBarBackground}>
                        <View
                          style={[
                            styles.pregressBar,
                            {
                              width: `${supplyPercentage}%`,
                              backgroundColor: supplyStatus.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round(supplyPercentage)}
                      </Text>
                    </View>
                    <View style={styles.refillInfo}>
                      <Text style={styles.refillLabel}>
                        Refill at: {medication.refillAt}
                      </Text>
                      {medication.lastRefillDate && (
                        <Text style={styles.lastRefillDate}>
                          Last Refill:{" "}
                          {new Date(
                            medication.lastRefillDate
                          ).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleRefill(medication)}>
                    <Text>Record Refill</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default RefillsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1ae2df",
  },
  content: {},
  header: {},
  headerGradient: {},
  medicationColor: {},
  pregressBar: {},
});
