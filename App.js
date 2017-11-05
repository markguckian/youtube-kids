import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  Picker,
  ActivityIndicator
} from "react-native";
import { StackNavigator } from "react-navigation";
import API from "./API";
import channels from "./channels";
import YouTubeView from "./YouTubeView";

class App extends Component {
  static navigationOptions = {
    title: "YouTube Kids",
    headerTitleStyle: {
      marginTop: 24,
      padding: 10,
      fontWeight: "500",
      fontSize: 24,
      alignSelf: "center"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      channel: "",
      data: []
    };
  }

  channelPicker(channel) {
    this.setState(
      {
        channel
      },
      () => this.update()
    );
  }

  update() {
    this.setState({
      isLoading: true
    });
    return fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API}&channelId=${this.state.channel}&part=snippet,id&order=date&maxResults=20`
    )
      .then(response => response.json())
      .then(responseJson => {
        let videos = [];
        responseJson.items.forEach(item => {
          videos.push(item);
        });
        this.setState({
          isLoading: false,
          channel: "",
          data: videos
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          isLoading: false
        });
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
        <Picker
          style={styles.picker}
          selectedValue={this.state.channel}
          onValueChange={(itemValue, itemIndex) =>
            this.channelPicker(itemValue)}
        >
          <Picker.Item value="" label="Select a channel to watch..." />
          {channels.map(channel => {
            return <Picker.Item label={channel.name} value={channel.id} key={channel.id} />;
          })}
        </Picker>
        <View style={styles.container}>
          {this.state.isLoading ? (
            <View style={styles.container}>
              <ActivityIndicator
                animating={this.state.isLoading}
                color="#FF1D00"
                size="large"
                style={styles.activityIndicator}
              />
            </View>
          ) : (
            this.state.data.map(
              item =>
                item.id.videoId ? (
                  <TouchableHighlight
                    key={item.id.videoId}
                    onPress={() =>
                      navigate("YouTubeView", { youtubeId: item.id.videoId })}
                  >
                    <View style={styles.button}>
                      <Image
                        source={{ uri: item.snippet.thumbnails.medium.url }}
                        style={{ width: 320, height: 180 }}
                      />
                      <Text style={styles.buttonText}>
                        {item.snippet.title}
                      </Text>
                    </View>
                  </TouchableHighlight>
                ) : null
            )
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#232323"
  },
  button: {
    marginTop: 15,
    marginBottom: 15,
    width: 300,
    alignItems: "center",
    backgroundColor: "#FF1D00",
    elevation: 1
  },
  buttonText: {
    padding: 10,
    fontSize: 18,
    color: "white"
  },
  picker: {
    padding: 5
  },
  activityIndicator: {
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#232323"
  }
});

export default (screens = StackNavigator({
  Home: { screen: App },
  YouTubeView: { screen: YouTubeView }
}));
