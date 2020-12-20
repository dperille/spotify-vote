import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import { AuthContext } from '../components/auth_context.js';

export class RoomNumberEntryScreen extends React.Component {

  static contextType = AuthContext

  constructor(props){
    super(props);

    this.state = {
      roomEntry: '',
    };
  }

  onChangeText = (entry) => {
    this.setState({ roomEntry: entry });
  }

  submit = () => {
    // TODO -- check server if valid room number.
    // for now, just let them in

    // set auth variables and move to main screen
    this.context['roomNumber'][1](this.state.roomEntry);
    this.context['inRoom'][1](true);
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
