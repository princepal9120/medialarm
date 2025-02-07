import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#1A8E2D", "#146922"]}>
        <View>
          <View>
            <View>
              <Text> Daily Progress</Text>
            </View>
            {/* <TouchableOpacity></TouchableOpacity> */}
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeScreen;
