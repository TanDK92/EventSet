import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import {
  Button, List, ListItem,
} from 'react-native-elements';
import moment from 'moment';
import { auth, database } from '../firebase';

export default class EventInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      switchValue: false,
      showDate: false,
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      alreadyVote: (props.event.voted ? props.event.voted.includes(auth.currentUser.uid) : false),
    };
    this.onValueChange = this.onValueChange.bind(this);
  }
	
  onValueChange(value){
    this.setState({switchValue: value});
  }

  onDateChange = (date) => {
    this.setState({date: date});
  };

	onVoteButton() {
    this.props.navigator.push({
        title: 'Vote',
        screen: 'example.VotePage',
				passProps: {
					event: this.props.event,
				},
    });
  }

  seeVote(){
    this.props.navigator.push({
        title: 'Vote Result',
        screen: 'example.VoteResult',
				passProps: {
					event: this.props.event,
				},
    });
  }

  closeVote() {
    const { event } = this.props;
    const locations = event.locations;
    let finalLocation = 'None';
    let maxScoreLocation = 0;
    for(const attName in locations) {
      const location = locations[attName];
      if(location.voter){
        const score = location.voter.reduce((acc, val) => { return acc += 1}, 0);
        if(score > maxScoreLocation) {
          finalLocation = location.name;
          maxScoreLocation = score;
        }
      }
    }

    const dates = event.dates;
    let finalDate = 'None';
    let maxScoreDate = 0;
    for(const attName in dates) {
      const date = dates[attName];
      if(date.voter){
        const score = date.voter.reduce((acc, val) => { return acc += 1}, 0);
        if(score > maxScoreDate) {
          finalDate = date.name;
          maxScoreDate = score;
        }
      }
    }
    
    database.ref().child('events').child(event.key).update({
      status: 'current',
      finalLocation: finalLocation,
      finalDate: finalDate,
    });
    this.props.navigator.pop();
  }

  render() {
    const { event } = this.props;
    const votedSection = () => {
      return (<View style={{flex: 1}}>
          <Button
            style={styles.button}
            title={event.status !== 'pending' ? 'See vote result' : 'Vote location and date'}
            onPress={() => {event.status !== 'pending' ? this.seeVote() : this.onVoteButton()}} 
          />
          {event.status === 'pending' ? 
            <Button
              title="Close vote"
              onPress={() => {this.closeVote();}} 
            /> : null
          }
        </View>);
    };
    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 10, paddingLeft: 10, paddingRight: 10}}>
            <Text style={styles.titleText}>{event.name}</Text>
            <Text numberOfLines={2}>
							{event.description}
						</Text>
        </View>
				<View style={{flex: 2}}>
          <Text style={styles.sectionHeader}>People</Text>
					<List containerStyle={{marginTop: 0}}>
            <ListItem
              title='Friend A'
              hideChevron
            />
          </List>
				</View>
				{ event.status !== 'pending' ?
				<View style={{flex: 2}}>
            <Text style={styles.sectionHeader}>Location</Text>
						<List containerStyle={{marginTop: 0}}>
							<ListItem
                title={event.finalLocation}
								hideChevron
							/>
						</List>
            <Text style={styles.sectionHeader}>Date</Text>
						<List containerStyle={{marginTop: 0}}>
              <ListItem 
                title={event.finalDate}
                hideChevron
              />
            </List>
					</View> : 
          votedSection()
				}
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
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	button: {
      marginBottom: 10,
	},
  sectionHeader: {
    fontSize: 14,
    backgroundColor: 'black',
    marginTop: 10,
    color: 'white',
    paddingLeft: 10,
  },
});