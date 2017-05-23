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
  List, ListItem
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
      haveVote: false,
      showDate: false,
      date: new Date(),
      finalDate: new Date(),
      location: '',
      showFinalDateSelect: false,
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onDateChange = this.onDateChange.bind(this);
    this.onDateFinalChange = this.onDateFinalChange.bind(this);
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'cancel') { 
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      }
      if (event.id === 'next') {
        const data = {
          name: this.state.title,
          description: this.state.description,
          status: (this.state.haveVote ? 'pending' : 'current'),
          closeDate: (this.state.haveVote ? this.state.date : 'None'),
          users: {
            [auth.currentUser.uid]: true,
          }
        };
        if(!this.state.haveVote) {
          data['finalLocation'] = this.state.location;
          data['finalDate'] = this.state.finalDate;
        }
        this.props.navigator.push({
          screen: 'example.InviteFriend',
          title: 'Invite Friends',
          passProps: {
            data: data,
          }
        });
      }
    }
  }

  onSwitch(){
    this.setState({haveVote: !this.state.haveVote });
  }

  onDateChange = (date) => {
    this.setState({date: date});
  };

  onDateFinalChange = (date) => {
    this.setState({finalDate: date});
  };

  render() {
    const renderClosed = (show) => {
      return show ?
        <ListItem 
            rightTitle={moment(this.state.date).format('DD/MM/YYYY')}
            rightTitleStyle={{color: 'black'}}
            title='Closed vote date'
            onPress={() => this.setState({showDate: !this.state.showDate})}
            hideChevron
          /> :
        [
          <ListItem 
            textInput
            textInputOnChangeText={(text) => {this.setState({location: text});}}
            textInputValue={this.state.location}
            title='Location'
            hideChevron
          />,
          <ListItem 
            rightTitle={moment(this.state.finalDate).format('MMMM Do YYYY, h:mm a')}
            rightTitleStyle={{color: 'black'}}
            title='Date time'
            onPress={() => this.setState({showFinalDateSelect: !this.state.showFinalDateSelect})}
            hideChevron
          />,
          ( this.state.showFinalDateSelect ? 
            <DatePickerIOS
                date={this.state.finalDate}
                mode="datetime"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={this.onDateFinalChange}
            /> : <View />
          )
        ]
    }

    const showOptions = (this.state.showDate && this.state.haveVote ? 
      <DatePickerIOS
              date={this.state.date}
              mode="date"
              timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
              onDateChange={this.onDateChange}
          /> : <View />)

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
              switched={this.state.haveVote}
              switchButton={true}
              hideChevron
            /> 
            { renderClosed(this.state.haveVote) }
            {showOptions}
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