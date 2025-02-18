import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const MEDICATION_KEY = "@medications";
const DOSE_HISTORY_KEY = "@dose_history";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  color: string;
  startDate: string;
  times: string[];
  notes: string;
  reminderEnabled: boolean;
  refillReminder: boolean;
  currentSupply: number;
  totalSupply: number;
  refillAt: number;
  lastRefillDate?: string;
}

export interface DoseHistory {
  id: string;
  medicationId: string;
  timeStamp: string;
  taken: boolean;
}

export async function getMedications(): Promise<Medication[]> {
  try {
    const data = await AsyncStorage.getItem(MEDICATION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting medications:", error);
    return [];
  }
}
export async function addMedication(medicaton: Medication): Promise<void> {
  try {
    const medications = await getMedications();
    medications.push(medicaton);
    await AsyncStorage.setItem(MEDICATION_KEY, JSON.stringify(medications));
  } catch (error) {
    throw error;
  }
}

export async function updateMedication(
  updatedMedication: Medication
): Promise<void> {
  try {
    const medications = await getMedications();
    const index = medications.findIndex(
      (med) => med.id === updatedMedication.id
    );
    if (index !== -1) {
      medications[index] = updateMedication;
      await AsyncStorage.setItem(MEDICATION_KEY, JSON.stringify(medications));
    }
  } catch (error) {
    console.error("Error while updating medications",error);
    throw error;
    
  }
}
export async function getDoseHistory(): Promise<DoseHistory[]> {
  try {
    const data = await AsyncStorage.getItem(DOSE_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting dose history:", error);
    return [];
  }
}

export async function getTodaysDoses(): Promise<DoseHistory[]> {
  try {
    const history = await getDoseHistory();
    const today = new Date().toDateString();
    return history.filter(
      (dose) => new Date(dose.timeStamp).toDateString() === today
    );
  } catch (error) {
    console.error("Error getting dose history:", error);
    return [];
  }
}
//create getdoseshistroy, getdtodaydoage, clear all details

export async function recordDose(
  medicationId: string,
  taken: boolean,
  timeStamp: string
): Promise<void> {
  try {
    const history = await getDoseHistory();
    history.push({
      id: Math.random().toString(36).substring(2, 9),
      medicationId,
      timeStamp,
      taken,
    });
    await AsyncStorage.setItem(DOSE_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error recording dose:", error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([MEDICATION_KEY, DOSE_HISTORY_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}
