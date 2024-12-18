import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectDetailsScreen = ({ route }) => {
  const { project } = route.params; // Receive the project from the navigation params

  const [hoursSpent, setHoursSpent] = useState(project.hours || 0); // Total hours worked
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer status
  const [startTime, setStartTime] = useState(null); // Store the start time
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds

  // Start/Stop the timer
  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);

      const totalElapsedTimeInHours = ((Date.now() - startTime)/10 / 60 / 60); // Convert seconds to hours
      const newTotalHoursSpent = hoursSpent + totalElapsedTimeInHours;

      setHoursSpent(newTotalHoursSpent); // Update total hours spent

      // Save the updated total hours in AsyncStorage
      AsyncStorage.setItem(`${project.name}_hoursSpent`, newTotalHoursSpent.toString());
      AsyncStorage.removeItem(`${project.name}_startTime`); // Clear the start time as the timer is stopped
    } else {
      setIsTimerRunning(true);
      setStartTime(Date.now()); // Store the current time as the start time
      setElapsedTime(0); // Reset elapsed time when timer starts

      // Save the start time in AsyncStorage
      AsyncStorage.setItem(`${project.name}_startTime`, Date.now().toString());
    }
  };

  // Update the elapsed time every second while the timer is running
  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1); // Increment elapsed time by 1 second
      }, 10);
    }

    // Clean up the interval when the timer is stopped
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Load project data from AsyncStorage when the screen is loaded
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const savedHours = await AsyncStorage.getItem(`${project.name}_hoursSpent`);
        const savedStartTime = await AsyncStorage.getItem(`${project.name}_startTime`);

        if (savedHours) {
          setHoursSpent(parseFloat(savedHours)); // Restore saved total hours
        }

        if (savedStartTime) {
          setStartTime(parseInt(savedStartTime)); // Restore saved start time
          setIsTimerRunning(true); // If a start time exists, the timer should be running
        }
      } catch (error) {
        console.error('Failed to load project data from storage', error);
      }
    };

    loadProjectData();
  }, [project.name]);

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.details}>Client: {project.client}</Text>
      <Text style={styles.details}>
        {project.isHourly
          ? `Hourly Rate: ${project.hourlyRate}`
          : `Total Price: ${project.totalPrice}`}
      </Text>

      <Text style={styles.timer}>
        Total Hours Spent: {hoursSpent.toFixed(2)} hours
      </Text>

      {/* Display the current elapsed time in minutes and seconds */}
      <Text style={styles.timer}>
        Elapsed Time: {minutes} min {seconds} sec
      </Text>

      <Button
        title={isTimerRunning ? 'Stop Timer' : 'Start Timer'}
        onPress={toggleTimer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProjectDetailsScreen;
