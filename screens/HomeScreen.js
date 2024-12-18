import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);

  // Fetch projects from AsyncStorage
  const fetchProjects = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectPress = (project) => {
    navigation.navigate('ProjectDetails', { project });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handleProjectPress(item)}
          >
            <Text style={styles.projectText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title="Add New Project"
        onPress={() =>
          navigation.navigate('AddProject', {
            refreshProjects: fetchProjects, // Pass the function to refresh projects
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  projectItem: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  projectText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
