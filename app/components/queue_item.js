import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { socket } from './socket.js';

export class QueueItem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: props.title,
            artist: props.artist,
            votes: props.votes,
            listId: props.listId,
        };

        this.voteUp = this.voteUp.bind(this);
        this.voteDown = this.voteDown.bind(this);
    }

    voteUp() {
        socket.emit('vote-up', this.state.listId);
    }

    voteDown() {
        socket.emit('vote-down', this.state.listId);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.upVoteButton} onPress={this.voteUp}>

                </TouchableOpacity>

                <View style={styles.songInfo}>
                    <Text>{this.state.title}</Text>
                    <Text>{this.state.artist}</Text>
                    <Text>{this.state.votes}</Text>
                </View>

                <TouchableOpacity style={styles.downVoteButton} onPress={this.voteDown}>

                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        height: 70,
        marginVertical: 5,
        flexDirection: 'row',
    },

    songInfo: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    upVoteButton: {
        width: '10%',
        height: '100%',
        backgroundColor: 'green',
    },

    downVoteButton: {
        width: '10%',
        backgroundColor: 'red',
        height: '100%',
    }
});
