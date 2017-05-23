import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  List, ListItem, Badge,
} from 'react-native-elements'
import moment from 'moment';
import { database } from '../firebase';

export default class VoteResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      dates: [],
    }
    this.eventRef = database.ref().child('events').child(this.props.event.key);
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

  render() {
    const { locations, dates } = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Location</Text>
          <ScrollView>
            { locations.map((lo) => {
              const score = lo.voter ? lo.voter.length : 0;
              return (
                <ListItem
                  key={lo.id}
                  title={lo.name}
                  badge={{ value: score, badgeTextStyle: { color: 'orange' }}}
                  hideChevron
                />
              );
            })}
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Dates</Text>
          <ScrollView>
            { dates.map((date) => {
              const score = date.voter ? date.voter.length : 0;
              return (
                <ListItem
                  key={date.id}
                  title={moment(date.name).format('MMMM Do YYYY, h:mm a')}
                  badge={{ value: score, badgeTextStyle: { color: 'orange' }}}
                  hideChevron
                />
              );
            })}
          </ScrollView>
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