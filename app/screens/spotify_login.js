import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import spotifyAuthHandler from '../components/spotify_auth_handler.js';

export function SpotifyLoginScreen() {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => spotifyAuthHandler.onLogin()}>
        <Text style={styles.buttonText}>Login to Spotify</Text> 
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },

  button: {
    width: '100%',
    height: '20%',
    backgroundColor: 'green',
  },

  buttonText: {
    color: 'white',
  }

});
