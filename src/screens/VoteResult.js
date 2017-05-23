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
  List, ListItem, Badge,
} from 'react-native-elements'
import moment from 'moment';
import { database } from '../firebase';

export default class VoteResult extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = database.ref().child('events').child(this.props.event.key);
  }

  render() {
    const { event } = this.props;
    return (
      <View style={styles.container}>
        <View style={{flex: 1, paddingTop: 60}}>
          <Text style={styles.sectionHeader}>Location</Text>
          { event.locations ? event.locations.map((lo) => {
            return (
              <ListItem
                key={event.locations.indexOf(lo)}
                title={lo.name}
                badge={{ value: lo.score, badgeTextStyle: { color: 'orange' }}}
                hideChevron
              />
            );
          }) : <View />}
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Dates</Text>
          { event.dates ? event.dates.map((date) => {
            return (
              <ListItem
                key={event.locations.indexOf(date)}
                title={date.name}
                badge={{ value: date.score, badgeTextStyle: { color: 'orange' }}}
                hideChevron
              />
            );
          }) : <View />}
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