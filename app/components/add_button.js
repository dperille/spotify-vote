import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export class AddButton extends React.Component {
    
    constructor(props){
        super(props);

        this.navigation = props.navigation;
    }

    render() {
        return (
            <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                this.navigation.navigate("Add");
            }}>
                <Text>Add Song</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    buttonContainer: {
        width: '90%',
        height: '10%',
        borderRadius: 100,
        backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

});
