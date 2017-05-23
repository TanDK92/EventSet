import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
  TextInput,
  AlertIOS,
} from 'react-native';
import {
  CheckBox,
} from 'react-native-elements';
import moment from 'moment';
// import SelectFriends from './SelectFriends';
import { database, auth } from '../firebase';

export default class VotePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      dates: [],
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
    this.eventRef = database.ref().child('events').child(this.props.event.key);
    this.onCheckLocations = this.onCheckLocations.bind(this);
    this.onCheckDates = this.onCheckDates.bind(this);
    this.newLocation = this.newLocation.bind(this);
  }

  componentDidMount() {
    this.eventRef.child('locations').on('value', (snap) => {
      const locations = [];
      snap.forEach((child) => {
        const location = child.val();
        location['id'] = child.key;
        locations.push(location);
      });
      this.setState({ locations: locations });
    });

    this.eventRef.child('dates').on('value', (snap) => {
      const dates = [];
      snap.forEach((child) => {
        const date = child.val();
        date['id'] = child.key;
        dates.push(date);
      });
      this.setState({ dates: dates });
    });
  }

  onCheckLocations(id){
    const vote = this.state.locations.find((lo) => { return lo.id === id }).voter || [];
    const uid = auth.currentUser.uid;
    if(vote.includes(auth.currentUser.uid)){
      const index = vote.indexOf(uid);
      vote.splice(index, 1);
    } else {
      vote.push(uid);
    }
    this.eventRef.child('locations').child(id).update({
      voter: vote,
    });
  }

  onCheckDates(id){
    const vote = this.state.dates.find((date) => { return date.id === id }).voter || [];
    const uid = auth.currentUser.uid;
    if(vote.length > 0 && vote.includes(auth.currentUser.uid)){
      const index = vote.indexOf(uid);
      vote.splice(index, 1);
    } else {
      vote.push(uid);
    }
    this.eventRef.child('dates').child(id).update({
      voter: vote,
    });
  }

  addLocation() {
    AlertIOS.prompt(
      'Add New Location',
      null,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: (text) => {
            this.newLocation(text);
          }
        },
      ],
      'plain-text'
    );
  }

  addDate() {
    AlertIOS.prompt(
      'Add New Date',
      null,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: (text) => {
            this.newDate(text);
          }
        },
      ],
      'plain-text'
    );
  }

  newLocation(locationName) {
    const locationRef = this.eventRef.child('locations');
    const data = {
      score: 0,
      name: locationName
    };
    const newKey = locationRef.push().key;
    let updates = {};
    updates[newKey] = data;

    locationRef.update(updates);
  }

  newDate(dateTime) {
    const dateRef = this.eventRef.child('dates');
    const data = {
      name: dateTime
    };
    const newKey = dateRef.push().key;
    let updates = {};
    updates[newKey] = data;

    dateRef.update(updates);
  }

  render() {
    const { event } = this.props;
    const { addLocation, locations, dates } = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Location</Text>
          { locations.map((lo) => {
            return (
              <CheckBox
                key={lo.id}
                title={lo.name}
                checked={lo.voter && lo.voter.includes(auth.currentUser.uid)}
                onPress={() => {this.onCheckLocations(lo.id)}}
              />
            );
          })}
          <Button title="Add location" onPress={() => {this.addLocation();}} />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Dates</Text>
          { dates.map((date) => {
            return (
              <CheckBox
                key={date.id}
                title={date.name}
                checked={date.voter && date.voter.includes(auth.currentUser.uid)}
                onPress={() => {this.onCheckDates(date.id)}}
              />
            );
          })}
          <Button title="Add datetime" onPress={() => {this.addDate();}} />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'flex-start',
  },
  input: {
    height: 30, 
    width: '70%', 
    borderColor: 'gray', 
    borderWidth: 1,
    marginLeft: '20%',
  },
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	button: {
    color: 'blue',
	},
  sectionHeader: {
    fontSize: 14,
    backgroundColor: 'black',
    marginTop: 10,
    color: 'white',
    paddingLeft: 10,
  },
});