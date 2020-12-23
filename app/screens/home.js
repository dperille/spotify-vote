import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native';

import { socket } from '../components/socket.js';
import { QueueItem } from '../components/queue_item.js';
import { AddButton } from '../components/add_button.js';
import { AuthContext } from '../components/auth_context.js';

export class HomeScreen extends React.Component {

    static contextType = AuthContext;

    constructor(props){
        super(props);

        this.state = {
            queue: [],
        };

        this._isMounted = false;

        this.onNewQueue = this.onNewQueue.bind(this);
        socket.on('new-queue', this.onNewQueue);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onNewQueue(newQueue) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this._isMounted && this.setState({
            queue: newQueue,
        });
    }

    render() {
        let list_of_components = this.state.queue.map( (data) => {
            return (
                <QueueItem key={data['id']} listId={data['id']} title={data['title']} artist={data['artist']} album={data['album']} imageUrl={data['imageUrl']} uri={data['uri']} votes={data['votes']}/>
            )
        });

        return (
            <View style={styles.container}>
                <View style={styles.roomNumberBar}>
                    <Text>{this.context['roomNumber'][0]}</Text>
                </View>
                <AddButton style={styles.addButton} navigation={this.props.navigation}/>
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

    roomNumberBar: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '15%',
        width: '100%',
    },
    
});
