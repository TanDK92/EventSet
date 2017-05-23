import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
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
      name: '',
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { 
      if (event.id === 'add') {
        this.props.submit(this.state.name);
      }
      this.props.navigator.dismissModal({
        animationType: 'slide-down'
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <List>
          <ListItem 
            textInput
            textInputOnChangeText={(text) => {this.setState({name: text});}}
            textInputValue={this.state.name}
            title='Name'
            hideChevron
          />
        </List>
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
  sectionHeader: {
    fontSize: 14,
    backgroundColor: 'black',
    marginTop: 10,
    color: 'white',
    paddingLeft: 10,
  },
});