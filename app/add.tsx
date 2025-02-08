import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const AddMedicationScreen = () => {
  return (
    <View>
        <LinearGradient colors={["#1a8e2d",
            "#146922"
        ]}
        start={{x:0, y:0}}
        end={{x:1,y:1}}
        />
      <Text>AddMedicationScreen</Text>
    </View>
  )
}

export default AddMedicationScreen

const styles = StyleSheet.create({})