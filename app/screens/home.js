import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native';

import { socket } from '../components/socket.js';
import { QueueItem } from '../components/queue_item.js';
import { AddButton } from '../components/add_button.js';
import { AuthContext } from '../components/auth_context.js';
import globalStyles from '../styles/global_styles.js';

export class HomeScreen extends React.Component {

    static contextType = AuthContext;

    constructor(props, context){
        super(props, context);

        this.state = {
            currTrackUri: 'none',
            newSong: false,
            queue: [],
        };

        this._isMounted = false;

        // bind functions for access within other functions
        this.onNewQueue = this.onNewQueue.bind(this);
        this.getCurrTrackUri = this.getCurrTrackUri.bind(this);
        this.pollSongChange = this.pollSongChange.bind(this);
        
        // set up listening for new queue and new access token
        socket.on('new-queue', this.onNewQueue);
        socket.on('give-access-token', (token) => {
            this.context['spotifyAccessToken'][1](token);
        });

        // start polling for song changes if host
        if(this.context['isHost'][0]){
            this.getCurrTrackUri()
                .then( ([uri, time]) => this.setState({ currTrackUri: uri }) );
            this.pollSongChange();
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onNewQueue(newQueue) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this._isMounted && this.setState({
            queue: newQueue,
        });
    }

    /* Polls the Spotify API every 3 seconds to check if the currently
       playing song has changed. Plays the next track in the queue if 
       track has changed. 
       (Polling is unfortunately necessary, as
       the Spotify Web API provides no way of notifying song change.) */
    async pollSongChange() {
        const [ currTrackUri, currProgressMs ] = await this.getCurrTrackUri();
        console.log("Heard curr track as: " + currTrackUri);

        // If the track has changed, or we're in the same song but back at the
        // start (track skipped or finished with no song next in queue), then
        // play the next song
        if(currTrackUri != this.state.currTrackUri) {
            this.playNextSong();
        }
        else if(!this.state.newSong && currProgressMs < 2) {
            this.playNextSong()
        }
        else if(this.state.newSong) {
            this.setState({ newSong: false });
        }

        // poll again in 3 seconds
        setTimeout(this.pollSongChange, 3000);
    }

    playNextSong() {
        // If queue has songs, remove the top one and play it.
        if(this.state.queue.length > 0) {
            // Get the top song from the server and play it
            socket.emit('get-and-remove-top-song');
            socket.on('get-top-song', (uri) => {
                // Play song through API
                fetch('https://api.spotify.com/v1/me/player/play', {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + this.context['spotifyAccessToken'][0],
                    },
                    body: JSON.stringify({
                        uris: [uri],
                    }),
                })
                .then(this.setState({ newSong: true, currTrackUri: uri }));
                /* TODO - error checking (403)
                .then(res => res.json())
                .then(result => console.log(result));*/
            });
        }
    }

    // Gets the URI of the user's currently playing track
    async getCurrTrackUri() {
        try {
            const result = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.context['spotifyAccessToken'][0],
                },
            });

            const res = await result.json();
            
            return [ res['item']['uri'], res['progress_ms'] ];
        }
        catch(error){
            // TODO - check return code 204, no song currently playing
            return "none";
        }
    }

    render() {
        let list_of_components = this.state.queue.map( (data) => {
            return (
                <QueueItem key={data['id']} listId={data['id']} title={data['title']} artist={data['artist']} album={data['album']} imageUrl={data['imageUrl']} uri={data['uri']} votes={data['votes']}/>
            )
        });

        return (
            <View style={styles.container}>
                <View style={styles.roomNumberBar}>
                    <Text style={styles.roomNumberText}>Room {this.context['roomNumber'][0]}</Text>
                </View>
                <AddButton style={styles.addButton} navigation={this.props.navigation}/>
                <ScrollView style={styles.scrollContainer}>
                    {list_of_components}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: globalStyles.colors.primary,
    },

    scrollContainer: {
        flex: 1,
        width: '100%',
        padding: '3%',
        backgroundColor: globalStyles.colors.tertiary,
    },

    roomNumberBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: '6%',
    },

    roomNumberText: {
        fontFamily: globalStyles.font.bold,  
        fontSize: 25,
        color: globalStyles.colors.secondary,
    },

});
