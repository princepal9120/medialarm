
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Medication } from "./storage";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
})


export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const {status }= await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return null;
    }

    try {
        const response =await Notifications.getExpoPushTokenAsync();
        token = response.data;
        if (Platform  .OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#1a8e2d", 
            })

        }
        return token;
    } catch (error) {
        console.error("Error getting push token:", error);
        return null;
        
    }
      
   
}

export async function scheduleMedicationReminder (medication: Medication): Promise<string | undefined> {

    if(!medication.reminderEnabled) return;
   
    try {
        for( const time of medication.times){
            const [hours, minutes] = time.split(":").map(Number);
            const today =new Date();
            today.setHours(hours, minutes, 0, 0);
            if(today < new Date()) today.setDate(today.getDate() + 1);

            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Medication Reminder",
                    body: `Take your ${medication.name} , ${medication.dosage} now!`,
                    data: { medicationId: medication.id },
                },
                trigger: {
                    hour: today.getHours(),
                    minute: today.getMinutes(),
                    repeats: true,
                },
            });
            return identifier;

        }
        
    } catch (error) {
        console.error("Error scheduling medication reminder:", error);
        return undefined;
        
    }


}

export async function cancelMedicationReminder(medicationId: string): Promise<void> {
    try {
       const scheduleNotifications= await Notifications.getAllScheduledNotificationsAsync();
       for (const notification of scheduleNotifications) {
        const data =notification.content.data as {
            medicationId?: string;
        } | null;
        if (data && data.medicationId === medicationId) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
       }
    } catch (error) {
        console.error("Error canceling medication reminder:", error);
        
    }
}


export async function updateMedicationReminders(medications: Medication): Promise<void> {
    try {
        // cancal existing reminders
        await cancelMedicationReminder(medications.id);
        // schedule new reminders   
        await scheduleMedicationReminder(medications);
    }catch(error){
        console.error("Error updating medication reminders:", error);
        
    }
}