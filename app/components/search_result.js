import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import globalStyles from '../styles/global_styles';

export class SearchResult extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      title: props.title,
      artist: props.artist,
      album: props.album,
      uri: props.uri,
      imageUrl: props.imageUrl,
      press: props.press,
    };

  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.state.press}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: this.state.imageUrl }} style={styles.image}/>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.songTitle} numberOfLines={1}>{this.state.title}</Text>
          <Text style={styles.songArtistAlbum} numberOfLines={1}>{this.state.artist}</Text>
          <Text style={styles.songArtistAlbum} numberOfLines={1}>{this.state.album}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    backgroundColor: globalStyles.colors.secondary,
    flexDirection: 'row',
    marginBottom: '2%',
    aspectRatio: 4,
    borderRadius: 3,
  },

  imageContainer: {
    width: '17%',
    justifyContent: 'center',
    marginLeft: '3%',
  },

  image: {
    aspectRatio: 1,
  },

  infoContainer: {
    flex: 1,
    paddingLeft: '2%',
    paddingRight: '8%',
    paddingTop: '1%',
    justifyContent: 'center',
  },
  
  songTitle: {
    fontFamily: globalStyles.font.bold,
    color: globalStyles.colors.primary,
    fontSize: 15,
  },

  songArtistAlbum: {
    fontFamily: globalStyles.font.normal,
    color: globalStyles.colors.primary,
  },
  
});
