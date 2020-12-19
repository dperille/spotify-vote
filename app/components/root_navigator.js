import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { HomeScreen } from '../screens/home.js';
import { AddScreen } from '../screens/add.js';
import { ChooseHostJoinScreen } from '../screens/choose_host_join.js';

import { AuthContext } from './auth_context.js';

const Stack = createStackNavigator();

export default function RootNavigator() {
  
  const authContext = React.useContext(AuthContext);

  //console.log(authContext['inRoom'][0]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
          { authContext['choseHostJoin'][0] == true
          ? (
            // Has chosen host or join yet
            <>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Add" component={AddScreen}/>
            </>
          ) 

          : (
              // Has not chosen yet
              <Stack.Screen name="ChooseHostJoin" component={ChooseHostJoinScreen}/>
            )
          }

      </Stack.Navigator>
    </NavigationContainer>
  )
}