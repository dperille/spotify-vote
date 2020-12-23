import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { HomeScreen } from '../screens/home.js';
import { AddScreen } from '../screens/add.js';
import { ChooseHostJoinScreen } from '../screens/choose_host_join.js';
import { RoomNumberEntryScreen } from '../screens/room_number_entry.js';
import { SpotifyLoginScreen } from '../screens/spotify_login.js';

import { AuthContext } from './auth_context.js';

const Stack = createStackNavigator();

export default function RootNavigator() {
  
  const authContext = React.useContext(AuthContext);

  //console.log(authContext['inRoom'][0]);

  const getNavFlow = () => {
    // Has not yet chosen host or join. Start there
    if(authContext['choseHostJoin'][0] == false) {
      return (
        <Stack.Screen name="ChooseHostJoin" component={ChooseHostJoinScreen}/>
      )
    }

    // Has chosen host/join
    else {

      // Chose to host
      // TODO
      if(authContext['isHost'][0] == true) {

        // Host has not authenticated with spotify yet
        if(authContext['spotifyAuthorized'][0] == false) {
          // TODO - spotify auth
          return ( 
            <Stack.Screen name="SpotifyLogin" component={SpotifyLoginScreen}/>
          )
        }

        // Host has already authenticated with spotify. Move
        // to main screen
        else {
          return ( 
            <>
              <Stack.Screen name="Home" component={HomeScreen}/>
              <Stack.Screen name="Add" component={AddScreen}/>
            </>
          )
        }
      }

      // Chose to join room
      else {

        // Has already joined room. Show main functionality
        if(authContext['inRoom'][0] == true) {
          return (
            <>
              <Stack.Screen name="Home" component={HomeScreen}/>
              <Stack.Screen name="Add" component={AddScreen}/>
            </>
          )
        }

        // Has not joined room yet. Ask for room number to join
        else {
          return <Stack.Screen name="RoomNumberEntry" component={RoomNumberEntryScreen}/>
        }
      }
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
          {getNavFlow()}
      </Stack.Navigator>
    </NavigationContainer>
  )
}