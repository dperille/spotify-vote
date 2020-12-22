import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';

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
        <Image source={{ uri: this.state.imageUrl }} style={styles.image}/>
        <View style={styles.infoContainer}>
          <Text>{this.state.title}</Text>
          <Text>{this.state.artist}</Text>
          <Text>{this.state.album}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
  },

  image: {
    height: 100,
    width: 100,
  },

  infoContainer: {

  },
  
});
