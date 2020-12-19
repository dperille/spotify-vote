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

        this._isMounted = false;

        this.onNewQueue = this.onNewQueue.bind(this);
        this.onSend = this.onSend.bind(this);
        socket.on('new-queue', this.onNewQueue);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSend(message) {
        socket.emit('add-song', "New Title", "New Artist", 0);
    }

    onNewQueue(newQueue) {
        this._isMounted && this.setState({
            queue: newQueue,
        });
    }

    render() {
        let list_of_components = this.state.queue.map( (data) => {
            return (
                <QueueItem key={data['id']} listId={data['id']} title={data['title']} artist={data['artist']} votes={data['votes']}/>
            )
        });

        return (
            <View style={styles.container}>
                <AddButton style={styles.addButton} navigation={this.props.navigation}/>
                <TouchableOpacity style={{backgroundColor: 'grey', width: '100%', height: '10%'}} onPress={this.onSend}/>
                <ScrollView style={styles.scrollContainer}>
                    {list_of_components}
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
