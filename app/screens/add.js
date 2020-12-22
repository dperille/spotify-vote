import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AuthContext } from '../components/auth_context';
import { SearchResult } from '../components/search_result.js';
import { socket } from '../components/socket.js';

export class AddScreen extends React.Component {

    static contextType = AuthContext;

    constructor(props){
        super(props);

        this.state = {
            query: '',   // current search query
            tracks: [],  // array of Objects for songs holding 'title', 'artist', 'album', and 'imageUrl'
            error: false,
        };

        this.onSearchButton = this.onSearchButton.bind(this);
        this.constructSearchGETString = this.constructSearchGETString.bind(this);
    }

    // user changes what's in search bar
    onChangeText = (text) => {
        this.setState({ query: text }, () => {

            if(text.length > 1){
                // automatically load results when search bar entry changes
                this.onSearchButton();
            }
            else {
                // clear results when search entry is cleared
                this.setState({ tracks: [], error: false })
            }

        });
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

            if(result['status'] != '200'){
                // API returned failure code -- display error message
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
                    uri: itemsArr[i]['uri'],
                    imageUrl: itemsArr[i]['album']['images'][0]['url'],
                });
            }
            
            // store the info about returned tracks in state
            this.setState({ tracks: songs, error: false });
        }
        catch(error) {
            this.setState({ tracks: [], error: true });
        }
    }

    addSongToQueue(title, artist){
        socket.emit('add-song', title, artist, 1);
    }

    render() {
        // create element for each search result
        let searchResults = this.state.tracks.map( (data, index) => {
            return (
                <SearchResult
                    key={data['uri']}
                    title={data['title']}
                    artist={data['artist']}
                    album={data['album']}
                    uri={data['uri']}
                    imageUrl={data['imageUrl']}
                    press={() => this.addSongToQueue(data['title'], data['artist'])}
                />
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
        width: '100%',
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
