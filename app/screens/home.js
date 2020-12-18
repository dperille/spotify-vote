import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import io from 'socket.io-client';
import { IP } from '../secrets.js';

export class HomeScreen extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        console.log("Mounted");
        this.socket = io(IP + ':3000');
        this.socket.emit('message', 'Hello from the app!');
    }

    render() {
        return (
            <View>
                <Text>Hi</Text>
            </View>
        )
    }

}
