import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import { AuthContext } from '../components/auth_context.js';
import { socket } from '../components/socket.js';
import globalStyles from '../styles/global_styles.js';

export class RoomNumberEntryScreen extends React.Component {

  static contextType = AuthContext

  constructor(props){
    super(props);

    this.state = {
      roomEntry: '',
      errorOnEntry: false,
    };
  }

  onChangeText = (entry) => {
    this.setState({ roomEntry: entry });
  }

  // called when submit button pressed
  submit = () => {
    // check if valid room number
    socket.emit('join-room', this.state.roomEntry);
    socket.on('join-room', (validRoom) => {
      if(validRoom){
        // set auth variables and move to main screen
        this.context['roomNumber'][1](this.state.roomEntry);
        this.context['inRoom'][1](true);
      }
      else {
        this.setState({ errorOnEntry: true });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.textInput}
          placeholder="Enter room number"
          placeholderTextColor={globalStyles.colors.primary}
          onChangeText={this.onChangeText}
        />

        <TouchableOpacity style={styles.button} onPress={this.submit}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>

        {this.state.errorOnEntry && <Text>Error: invalid room number</Text>}

      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: globalStyles.colors.primary,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    width: '90%',
    height: '15%',
    backgroundColor: globalStyles.colors.secondary,
    fontFamily: globalStyles.font.normal,
    fontSize: 25,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 5,
  },

  button: {
    width: '90%',
    height: '10%',
    backgroundColor: globalStyles.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: '10%',
  },

  buttonText: {
    fontFamily: globalStyles.font.bold,
    color: globalStyles.colors.secondary,
    fontSize: 25,
  },

});
