import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddProjectScreen from './screens/AddProjectScreen';
import ProjectDetailsScreen from './screens/ProjectDetailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddProject" component={AddProjectScreen} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;