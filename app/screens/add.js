import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../components/auth_context';

export class AddScreen extends React.Component {

    static contextType = AuthContext;

    constructor(props){
        super(props);

        this.state = {
            query: '',   // current search query
            tracks: [],  // array of Objects for songs holding 'title', 'artist', 'album', and 'image'
            error: false,
        };

        this.onSearchButton = this.onSearchButton.bind(this);
        this.constructSearchGETString = this.constructSearchGETString.bind(this);
    }

    // user changes what's in search bar
    onChangeText = (text) => {
        this.setState({ query: text });
    }

    // user presses search button
    async onSearchButton(){
        try {
            // query the spotify API for tracks matching what the user put in the search bar
            let result = await fetch(this.constructSearchGETString(this.state.query), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.context['spotifyAccessToken'][0],
                },
            });

            // API returned failure code -- display error message
            if(result['status'] != '200'){
                this.setState({ tracks: [], error: true });
                return;
            }

            // get name, artist, and album of tracks returned from API
            const json = await result.json();
            const itemsArr = json['tracks']['items'];
            let songs = [];
            var i;
            for(i = 0; i < itemsArr.length; i++){
                songs.push({
                    title: itemsArr[i]['name'],

                    // if multiple artists, join with commas
                    artist: itemsArr[i]['artists'].map( (artist) => artist['name']).join(', '),
                    album: itemsArr[i]['album']['name'],
                    // TODO - STORE URI
                    // TODO - store album image
                });
            }

            // store the info about returned tracks in state
            this.setState({ tracks: songs });
        }
        catch(error) {
            this.setState({ tracks: [], error: true });
        }
    }

    render() {
        // create element for each search result
        let searchResults = this.state.tracks.map( (data, index) => {
            return (
                <View key={index} style={styles.searchResult}>
                    <Text>{data['title']}</Text>
                    <Text>{data['artist']}</Text>
                    <Text>{data['album']}</Text>
                </View>
            )
        });

        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search Spotify"
                        placeholderTextColor="white"
                        onChangeText={this.onChangeText}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={this.onSearchButton}/>
                </View>
                { this.state.error && <Text>Error on search</Text> }
                <ScrollView style={styles.resultsContainer}>
                    {searchResults}
                </ScrollView>
            </View>
        )
    }

    // constructs the URL for the Spotify API GET request for searching query
    constructSearchGETString(query){
        let url = "https://api.spotify.com/v1/search?";

        const params = {
            q: query,
            type: 'track',
            limit: 15,   // number of results to return
            offset: 0,
        };

        url += Object.entries(params)
                     .map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
                     .join('&');

        return url;
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    searchContainer: {
        width: '100%',
        height: '15%',
        flexDirection: 'row',
    },

    searchBar: {
        backgroundColor: 'grey',
        height: '100%',
        width: '80%',
    },

    searchButton: {
        backgroundColor: 'green',
        height: '100%',
        flex: 1,
    },

    resultsContainer: {
        backgroundColor: 'black',
    },

    searchResult: {
        width: '100%',
        marginBottom: 10,
        height: 100,
        backgroundColor: 'white',
    },

});
