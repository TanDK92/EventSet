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
  static navigatorButtons = (this.status === 'current' ? {
    rightButtons: [
      {
        title: 'Passed',
        id: 'passed',
      }
    ]
  } : null);

  constructor(props) {
    super(props);
    this.state = {
      event: {},
      users: [],
    };
    this.status = this.props.event.status;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onValueChange = this.onValueChange.bind(this);
    this.toMember = this.toMember.bind(this);
  }

  componentWillMount() {
    const eventRef = database.ref().child('events').child(this.props.event.key);
    eventRef.on('value', (snap) => {
      this.setState({ event: snap.val() });
    });

    const userIds = this.props.event.users;
    const usersFire = database.ref().child('users');
    usersFire.on('value', (snap) => {
      const items = [];
      snap.forEach((child) => {
        if(userIds[child.key]) {
          const user = child.val();
          user['id'] = child.key;
          items.push(user);
        }
      });
      this.setState({ users: items });
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'passed') { 
        database.ref().child('events').child(this.props.event.key).update({
          status: 'passed',
        });
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      }
    }
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
    const { event } = this.state;
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
    database.ref().child('events').child(this.props.event.key).update({
      status: 'current',
      finalLocation: finalLocation,
      finalDate: finalDate,
    });
    this.props.navigator.pop();
  }

  toMember() {
    this.props.navigator.push({
      screen: 'example.MemberList',
      passProps: {
        members: this.state.users,
        eventId: this.props.event.key,
      }
    })
  }

  render() {
    const { users, event } = this.state;
    
    const votedSection = () => {
      return (<View style={{flex: 3}}>
          <Button
            style={styles.button}
            title={'Vote location and date'}
            onPress={() => {this.onVoteButton()}} 
          />
          {event.status === 'pending' ? 
            <Button
              style={styles.button}
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
				<View style={{flex: 1}}>
					<List containerStyle={{marginTop: 0}}>
            <ListItem 
              title="Members" 
              onPress={() => {this.toMember();} }/>
          </List>
				</View>
				{ event.status !== 'pending' ?
				<View style={{flex: 3}}>
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
                title={moment(event.finalDate).format('MMMM Do YYYY, h:mm a')}
                hideChevron
              />
            </List>
            <Button
              style={styles.button}
              title="See vote result"
              onPress={() => {this.seeVote();}} 
            />
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
      marginTop: 10,
	},
  sectionHeader: {
    fontSize: 14,
    backgroundColor: 'black',
    marginTop: 10,
    color: 'white',
    paddingLeft: 10,
  },
});