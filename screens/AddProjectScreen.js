import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProjectScreen = ({ navigation, route }) => {
  // State variables for project input
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [hours, setHours] = useState(0); // Set initial hours to 0
  const [totalPrice, setTotalPrice] = useState('');
  const [isHourly, setIsHourly] = useState(true); // Toggle switch state

  // Handle switch change
  const toggleSwitch = () => setIsHourly((previousState) => !previousState);

  const handleAddProject = async () => {
    // If hourly, calculate the total price based on the hourly rate and hours worked
    let calculatedTotalPrice = isHourly ? parseFloat(hourlyRate) * hours : parseFloat(totalPrice);

    // Create a new project object
    const newProject = {
      name,
      client,
      isHourly,
      hourlyRate: isHourly ? hourlyRate : null,
      hours: hours,
      totalPrice: isHourly ? null : totalPrice,
      total_price: calculatedTotalPrice,
    };

    try {
      // Fetch existing projects from AsyncStorage
      const storedProjects = await AsyncStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];

      // Add the new project to the list
      projects.push(newProject);

      // Save the updated list of projects back to AsyncStorage
      await AsyncStorage.setItem('projects', JSON.stringify(projects));

      // Navigate back to home screen
      navigation.goBack();
      // Optionally trigger a re-fetch of projects in the HomeScreen
      if (route.params?.refreshProjects) {
        route.params.refreshProjects();
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Client"
        value={client}
        onChangeText={setClient}
      />

      {/* Toggle for hourly or by completion */}
      <View style={styles.toggleContainer}>
        <Text>Hourly</Text>
        <Switch
          value={!isHourly}
          onValueChange={toggleSwitch}
        />
        <Text>By Completion</Text>
      </View>

      {/* Conditional inputs */}
      {isHourly ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Hourly Rate"
            keyboardType="numeric"
            value={hourlyRate}
            onChangeText={setHourlyRate}
          />
        </>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Total Price"
          keyboardType="numeric"
          value={totalPrice}
          onChangeText={setTotalPrice}
        />
      )}

      <Button title="Add Project" onPress={handleAddProject} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40, // Move the form up
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default AddProjectScreen;
