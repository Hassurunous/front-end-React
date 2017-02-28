// Import default components
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HeadNSub from './text-example';

// Define a stateful component
export default class Weather extends Component {
  // Initialize your component
  constructor(props) {
    super(props);
    // Define State for this component.
    // We'll set weather and position to null at default since there is no data yet.
    this.state = {weather:null, position:null};
    // Start the system by calling get location.
    console.log('Get location');
    this.getLocation();
  }

  getLocation() {
    // Get the location. You MUST set permission in info.plist!
    // Get the location with GPS getCurrentPosition(success, error, options)
    // ! Success and Error return JSON !
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log("- Get initial position");
        this.setState({position});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    // Watch the position. navigator.geolocation.watchPosition(callBack)
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var location = JSON.stringify(position);
      console.log("-- Watching Position update");
      console.log(position.coords);
      this.getWeather(position.coords.latitude, position.coords.longitude);
      this.setState({position});
      navigator.geolocation.clearWatch(this.watchID);
    });

  }


  componentWillUnmount() {
    // Clean up geolocation when this component is removed.
    navigator.geolocation.clearWatch(this.watchID);
  }

  getWeather(lat, lon) {
    // This example uses the Dark Sky API https://darksky.net/dev/
    // We need an API with HTTPS or we have to set up App Security in info.plist
    // Get your API Key
    const appkey = "768e23ad0120d9dc9708dadcd7506083";
    const url = "https://api.darksky.net/forecast/"+appkey+"/";
    const path = url+lat+","+lon;

    // Execute a network request. Fetch is promise based.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    // Below fetch returns a promies which passed to json() which returns another promies.
    // https://developer.mozilla.org/en-US/docs/Web/API/Body/json

    fetch(path)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Reponse JSON");
        // Print JSON to the console as a guide.
        console.log(responseJson);
        // Set state to weather data parsed from JSON.
        this.setState({weather:responseJson});
      })
      .catch((error) => {
        // Handle an error.
        console.error(error);
      });
  }

  render() {
    // Display the weather data in this component.
    // You'll need to check for data first since the data comes over the network.

    // Check position.
    var position = this.state.position;
    if (position != null) {
      position = `longitude: ${position.coords.longitude} latitude: ${position.coords.latitude}`;
    }

    // Check the weather. Be sure to check the console, and look at JSON output.
    var weather = {};
    if (this.state.weather != null) {
      const temp        = this.state.weather.currently.apparentTemperature;
      const cloudCover  = this.state.weather.currently.cloudCover;
      const summary     = this.state.weather.currently.summary;
      const windSpeed   = this.state.weather.currently.windSpeed;
      const dailySummary = this.state.weather.daily.summary;

      weather.temp = `${temp}`;
      weather.cloudCover = `${cloudCover}`;
      weather.summary = `${summary}`;
      weather.windSpeed = `${windSpeed}`;
      weather.dailySummary = `${dailySummary}`;
    }

    // Display stuff.
    return (
      <View>
        <Text>Hello Michael!</Text>
        <Text>Position: {position}</Text>
        <HeadNSub title={weather.temp} subheading="Fahrenheit"></HeadNSub>
        <Text>{weather.cloudCover}</Text>
        <Text>{weather.summary}</Text>
        <Text>{weather.windSpeed}</Text>
        <Text>{weather.dailySummary}</Text>
      </View>
    );
  }
}

// Create a stylesheet...
const styles = StyleSheet.create({

});
