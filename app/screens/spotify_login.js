import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../components/auth_context.js';

import spotifyAuthHandler from '../components/spotify_auth_handler.js';
import { socket } from '../components/socket.js';

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

          try {
            // call the spotify authorization and await the access and refresh tokens
            let { accessToken, refreshToken } = await spotifyAuthHandler.onLogin();

            // valid auth code -- set auth context variables and move to main functionality
            this.setState({ errorOnLogin: false });
            this.context['spotifyAccessToken'][1](accessToken);
            this.context['spotifyRefreshToken'][1](refreshToken);
            this.context['spotifyAuthorized'][1](true);

            // request room number and store it
            socket.emit('get-room');
            socket.on('give-room', (roomId) => {
              this.context['inRoom'][1](true);
              this.context['roomNumber'][1](roomId);

              // store the access token so all clients in the room can use it
              socket.emit('set-access-token', accessToken);
            });
          } 
          catch (error) {
            // invalid auth code -- display error
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
