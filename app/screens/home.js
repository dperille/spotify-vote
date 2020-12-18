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

        this.onNewQueue = this.onNewQueue.bind(this);
        this.onSend = this.onSend.bind(this);

        this.socket = io(IP + ':3000');
        this.socket.on('new-queue', this.onNewQueue);
    }

    onSend(message) {
        this.socket.emit('add-song', "New Title", "New Artist", 0);
    }

    onNewQueue(queue) {
        this.setState({
            queue: queue,
        });
    }

    render() {
        let list_of_messages = this.state.queue.map( (data, index) => {
            return (
                <View key={index} style={{height: 50, width: '100%', backgroundColor: 'green'}}>
                    <Text>{data['title']} / {data['artist']} / {data['votes']}</Text>
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
