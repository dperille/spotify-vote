import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../styles/global_styles';

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
                <Text style={styles.buttonText}>Add Song</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    buttonContainer: {
        width: '90%',
        height: '10%',
        borderRadius: 100,
        backgroundColor: globalStyles.colors.green,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%',
        marginBottom: '5%',
    },

    buttonText: {
        fontSize: 20,
        fontFamily: globalStyles.font.bold,
        color: globalStyles.colors.secondary,
    }

});
