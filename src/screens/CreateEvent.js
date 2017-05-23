import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  DatePickerIOS,
  TouchableHighlight,
} from 'react-native';
import {
  Button, List, ListItem, CheckBox,
} from 'react-native-elements'
import moment from 'moment';
import { database, auth } from '../firebase';

export default class CreateEvent extends Component {
  static navigatorButtons = {
    leftButtons: [
      {
        title: 'Cancel', // for a textual button, provide the button title (label)
        id: 'cancel', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ],
    rightButtons: [
      {
        title: 'Next',
        id: 'next',
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      switchValue: false,
      showDate: false,
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    // this.itemsRef = database.ref().child('events');
    this.onValueChange = this.onValueChange.bind(this);
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'cancel') { 
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      }
      if (event.id === 'next') {
        this.props.navigator.push({
          screen: 'example.InviteFriend',
          title: 'Invite Friends',
          passProps: {
            data: {
              name: this.state.title,
              description: this.state.description,
              status: 'pending',
            }
          }
        });
      }
    }
  }

  onValueChange(value){
    this.setState({switchValue: value});
  }

  onSwitch(){
    this.setState({switchValue: !this.state.switchValue });
  }

  onDateChange = (date) => {
    this.setState({date: date});
  };

  inviteFriend() {
    this.props.navigator.showModal({
        screen: 'example.InviteFriend',
        title: 'Invite Friends',
        passProps: {
          data: {
            name: this.state.title,
            description: this.state.description,
            status: 'pending',
          }
        }
    });
  }

  setInvited(test) {
    console.log(test);
  }

  render() {
    const renderClosed = (show) => {
      if (show) {
        return (
          <ListItem 
            rightTitle={moment(this.state.date).format('DD/MM/YYYY')}
            title='Closed Date'
            onPress={() => this.setState({showDate: !this.state.showDate})}
            onBlur={() => this.setState({ showDate: false })}
            hideChevron
          />);
      }
    }

    const showDatePicker = this.state.showDate ? 
      <DatePickerIOS
              date={this.state.date}
              mode="date"
              timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
              onDateChange={this.onDateChange}
          /> : <View />

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Information</Text>
					<TextInput
						style={styles.input}
						onChangeText={(title) => this.setState({title})}
						value={this.state.title}
						placeholder="Title"
					/>
					<TextInput
						style={styles.input}
						onChangeText={(description) => this.setState({description})}
						value={this.state.description}
						placeholder="Description"
					/>
        </View>
        <View style={{flex: 3, width: '100%'}}>
          <List>
            <ListItem
              title='Need vote'
              onSwitch={() => this.onSwitch()}
              switched={this.state.switchValue}
              switchButton={true}
              hideChevron
            /> 
            { renderClosed(this.state.switchValue) }
            {showDatePicker}
          </List>
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