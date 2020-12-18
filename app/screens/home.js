import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { socket } from '../components/socket.js';
import { QueueItem } from '../components/queue_item.js';
import { AddButton } from '../components/add_button.js';

export class HomeScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            queue: [],
        };

        this.onNewQueue = this.onNewQueue.bind(this);
        this.onSend = this.onSend.bind(this);
        socket.on('new-queue', this.onNewQueue);
    }

    onSend(message) {
        socket.emit('add-song', "New Title", "New Artist", 0);
    }

    onNewQueue(queue) {
        this.setState({
            queue: queue,
        });
    }

    render() {
        let list_of_messages = this.state.queue.map( (data, index) => {
            return (
                <QueueItem key={index} listId={index} title={data['title']} artist={data['artist']} votes={data['votes']}/>
            )
        })

        return (
            <View style={styles.container}>
                <AddButton style={styles.addButton} navigation={this.props.navigation}/>
                <ScrollView style={styles.scrollContainer}>
                    <QueueItem title={"Sample title"} artist={"Sample artist"} votes={1} listId={0}/>
                    {list_of_messages}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
    },

    scrollContainer: {
        width: '100%',
    },
    
});
