import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global_styles.js';

import { AuthContext } from '../components/auth_context.js';

export class ChooseHostJoinScreen extends React.Component {

    static contextType = AuthContext

    constructor(props){
        super(props);

        this.chooseHost = this.chooseHost.bind(this);
        this.chooseJoin = this.chooseJoin.bind(this);
    }

    chooseHost() {
        this.context['choseHostJoin'][1](true);
        this.context['isHost'][1](true);
    }

    chooseJoin() {
        this.context['choseHostJoin'][1](true);
        this.context['isHost'][1](false);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.chooseHost}>
                    <Text style={styles.buttonText}>HOST</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={this.chooseJoin}>
                    <Text style={styles.buttonText}>JOIN</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center',
    },

    button: {
        width: '100%',
        flex: 1,
        backgroundColor: globalStyles.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: 50,
        fontFamily: globalStyles.font.bold,
        color: globalStyles.colors.secondary,
    },
});
