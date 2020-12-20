import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../components/auth_context.js';

import spotifyAuthHandler from '../components/spotify_auth_handler.js';

export class SpotifyLoginScreen extends React.Component {

  static contextType = AuthContext;

  constructor(props){
    super(props);

    this.state = {
      errorOnLogin: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={async () => {
          // call the spotify authorization and await the authorization token
          let authCode = await spotifyAuthHandler.onLogin();

          // valid auth code -- set context variables to move on to main functionality
          if(authCode != null){
            this.setState({ errorOnLogin: false });
            this.context['spotifyAuthToken'][1](authCode);
            this.context['spotifyAuthorized'][1](true);
          }

          // invalid auth code -- display error
          else {
            this.setState({ errorOnLogin: true });
          }
        }}>
          <Text style={styles.buttonText}>Login to Spotify</Text> 
        </TouchableOpacity>

        {this.state.errorOnLogin && <Text>Error on login</Text>}
        
      </View>
    )
  }
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
