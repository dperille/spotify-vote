import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import { AuthContext } from '../components/auth_context.js';
import { socket } from '../components/socket.js';

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
    socket.emit('check-room-number', this.state.roomEntry);
    socket.on('check-room-number', (validRoom) => {
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
          placeholderTextColor="white"
          onChangeText={this.onChangeText}
        />

        <TouchableOpacity style={styles.button} onPress={this.submit}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>

        {this.state.errorOnEntry && <Text>Error: invalid room number</Text>}

      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center'
  },

  textInput: {
    width: '100%',
    height: '20%',
    backgroundColor: 'grey',
  },

  button: {
    width: '100%',
    height: '20%',
    backgroundColor: 'green',
  },

  buttonText: {

  },

});
