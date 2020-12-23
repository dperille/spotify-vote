import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AuthContext } from '../components/auth_context';
import { SearchResult } from '../components/search_result.js';
import { socket } from '../components/socket.js';
import globalStyles from '../styles/global_styles';

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

        // listen for access token changes
        socket.on('give-access-token', (token) => {
            this.context['spotifyAccessToken'][1](token);
        });
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
            // invalid access token, we need to set it before searching
            if(this.context['spotifyAccessToken'][0] == null){
                socket.emit('get-access-token', (token) => {
                    this.context['spotifyAccessToken'][1](token);
                });
            }
            
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

    addSongToQueue(title, artist, album, imageUrl, uri){
        const song = {
            'title': title,
            'artist': artist,
            'album': album,
            'imageUrl': imageUrl,
            'uri': uri,
        };

        socket.emit('add-song', song);
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
                    press={() => this.addSongToQueue(data['title'], data['artist'], data['album'], data['imageUrl'], data['uri'])}
                />
            )
        });

        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search Spotify"
                        placeholderTextColor={globalStyles.colors.primary}
                        onChangeText={this.onChangeText}
                        autoCorrect={false}
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
        alignItems: 'center',
        flex: 1,
        backgroundColor: globalStyles.colors.primary,
    },

    searchContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '23%',
    },

    searchBar: {
        backgroundColor: globalStyles.colors.secondary,
        height: '50%',
        width: '90%',
        borderRadius: 5,
        fontFamily: globalStyles.font.bold,
        textAlign: 'center',
        fontSize: 25,
    },

    resultsContainer: {
        width: '100%',
        backgroundColor: globalStyles.colors.tertiary,
        padding: '3%',
    },

});
