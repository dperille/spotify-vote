import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export class QueueItem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: props.title,
            artist: props.artist,
            votes: props.votes,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.title}</Text>
                <Text>{this.state.artist}</Text>
                <Text>{this.state.votes}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        height: 50,
        marginVertical: 5,
    },
});
