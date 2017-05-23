import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  DatePickerIOS,
} from 'react-native';
import {
  List, ListItem
} from 'react-native-elements'
import moment from 'moment';

export default class AddDateTime extends Component {
  static navigatorButtons = {
    leftButtons: [
      {
        title: 'Cancel', // for a textual button, provide the button title (label)
        id: 'cancel', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ],
    rightButtons: [
      {
        title: 'Add',
        id: 'add',
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { 
      if (event.id === 'add') {
        this.props.submit(this.state.datetime);
      }
      this.props.navigator.dismissModal({
        animationType: 'slide-down'
      });
    }
  }


  onDateChange = (datetime) => {
    this.setState({datetime: datetime});
  };

  render() {
    return (
      <View style={styles.container}>
        <DatePickerIOS
            date={this.state.datetime}
            mode="datetime"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange}
        />
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
    height: 40, 
    width: '100%', 
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 5,
  },
	button: {
		width: '70%',
	},
  sectionHeader: {
    fontSize: 14,
    backgroundColor: 'black',
    marginTop: 10,
    color: 'white',
    paddingLeft: 10,
  },
});