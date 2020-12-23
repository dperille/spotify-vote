import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/global_styles.js';

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

                <View style={styles.imageContainer}>
                    <Image source={{ uri: this.state.imageUrl }} style={styles.image}/>
                </View>

                <View style={styles.songInfoContainer}>
                    <Text style={styles.songTitle} numberOfLines={1}>{this.state.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1}>{this.state.artist}</Text>
                </View>

                <View style={styles.voteContainer}>
                    <TouchableOpacity style={styles.voteButtonContainer} onPress={this.voteUp}>
                        <Image source={require('../assets/arrow_up.png')} style={styles.voteButtonImage}/>
                    </TouchableOpacity>
                    <Text style={styles.voteCount}>
                        {this.state.votes > 0 ? "+" + this.state.votes : this.state.votes}
                    </Text>
                    <TouchableOpacity style={styles.voteButtonContainer} onPress={this.voteDown}>
                        <Image source={require('../assets/arrow_down.png')} style={styles.voteButtonImage}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 4,
        backgroundColor: globalStyles.colors.secondary,
        marginBottom: '2%',
        flexDirection: 'row',
        borderRadius: 3,
    },

    songInfoContainer: {
        flex: 1,
        paddingLeft: '2%',
        paddingTop: '1%',
        justifyContent: 'center',
    },

    songTitle: {
        fontFamily: globalStyles.font.bold,
        color: globalStyles.colors.primary,
        fontSize: 15,
    },

    songArtist: {
        fontFamily: globalStyles.font.normal,
        color: globalStyles.colors.primary,
    },

    voteContainer: {
        width: '15%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    voteButtonContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    voteButtonImage: {
        width: '80%',
        height: '80%',
        tintColor: globalStyles.colors.primary,
    },

    voteCount: {
        fontFamily: globalStyles.font.bold,
        color: globalStyles.colors.primary,
    },

    imageContainer: {
        width: '17%',
        justifyContent: 'center',
        marginLeft: '3%',
    },

    image: {
        aspectRatio: 1,
    }
});
