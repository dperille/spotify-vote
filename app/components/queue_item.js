import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { socket } from './socket.js';

export class QueueItem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: props.title,
            artist: props.artist,
            album: props.album,
            imageUrl: props.imageUrl,
            uri: props.uri,
            votes: props.votes,
            listId: props.listId,
        };

        this.voteUp = this.voteUp.bind(this);
        this.voteDown = this.voteDown.bind(this);

        // listen for vote changes to update this component directly
        socket.on('vote-up', (listId, voteCount) => {
            if(listId == this.state.listId){
                this.setState({
                    votes: voteCount,
                });
            }
        });

        socket.on('vote-down', (listId, voteCount) => {
            if(listId == this.state.listId){
                this.setState({
                    votes: voteCount,
                });
            }
        });
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

                <Image source={{ uri: this.state.imageUrl }} style={styles.image}/>

                <View style={styles.songInfo}>
                    <Text numberOfLines={1}>{this.state.title}</Text>
                    <Text numberOfLines={1}>{this.state.artist}</Text>
                    <Text numberOfLines={1}>{this.state.votes}</Text>
                    <Text numberOfLines={1}>{this.state.uri}</Text>
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
    },

    image: {
        width: 25,
        height: 25,
    }
});
