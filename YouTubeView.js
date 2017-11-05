import React, { Component } from 'react';
import { StyleSheet, WebView } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class YouTubeView extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <WebView
        style={styles.webview}
        javaScriptEnabled={true}
        source={{
          uri: `https://www.youtube.com/embed/${this.props.navigation.state.params.youtubeId}?rel=0&autoplay=0&showinfo=0&controls=0`
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  text: {
    fontSize: 40
  },
  webview: { flex: 1, marginTop: 20 }
});
