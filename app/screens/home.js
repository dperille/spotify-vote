import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import io from 'socket.io-client';
import { IP } from '../secrets.js';

export class HomeScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            queue: [],
        };

        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);

        this.socket = io(IP + ':3000');
        this.socket.on('message', this.onReceivedMessage);
    }

    onSend(message) {
        this.socket.emit('message', message);
    }

    onReceivedMessage(message) {
        this.setState({
            queue: this.state.queue.concat([message]),
        });

        console.log("Client received: " + message);
    }

    render() {
        let list_of_messages = this.state.queue.map( (data, index) => {
            return (
                <View key={index} style={{height: 50, width: '100%', backgroundColor: 'green'}}>
                    <Text>{index}</Text>
                </View>
            )
        })

        return (
            <>
            <TouchableOpacity onPress={() => this.onSend("SENDING MESSAGE!!!")} style={styles.container}>
                <Text>Hi</Text>
            </TouchableOpacity>
            {list_of_messages}
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '25%',
        width: '100%',
        backgroundColor: 'blue',
    },

    
});
