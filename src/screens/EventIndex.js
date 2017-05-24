import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  ScrollView,
  AlertIOS,
} from 'react-native';
import {
  List, ListItem, ButtonGroup
} from 'react-native-elements'
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import { database, auth } from '../firebase';

export default class EventIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 1,
      events: [],
    }
    this.itemsRef = database.ref().child('events');
  }

   onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'new') { 
        this.props.navigator.showModal({
          screen: "example.CreateEvent", // unique ID registered with Navigation.registerScreen
          title: "New Event", // title of the screen as appears in the nav bar (optional)
          passProps: {}, // simple serializable object that will pass as props to the modal (optional)
          animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
      }
    }
  }

  componentDidMount() {
    const userEvents = database.ref().child('users').child(auth.currentUser.uid).child('events');
    this.listenForItems(userEvents);
  }

  listenForItems(eventPermission) {
    let eIds = [];
    eventPermission.on('value', (snap) => {
      eIds = [];
      snap.forEach((child) => {
        if(child.val()){
          eIds.push(child.key);
        }
      });
    });
    const eventsFire = database.ref().child('events');
    eventsFire.on('value', (snap) => {
      const items = [];
      snap.forEach((child) => {
        if(eIds.includes(child.key)) {
          const event = child.val();
          event['key'] = child.key;
          items.push(event);
        }
      });
      this.setState({ events: items });
    });
  }

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex});
  }

  onSelectEvent(data) {
    const navigateData = {
				title: data.name,
				screen: 'example.EventInfo',
        passProps: { 
          event: data 
        },
		}
    if ( data.status !== 'passed') {
      navigateData.rightButtonTitle = 'Edit';
    }
    this.props.changeScreen(navigateData);
  }

  removeEvent(id){
    const eventPermissionRef = database.ref().child('users').child(auth.currentUser.uid).child('events');
    AlertIOS.alert(
      'Delete event',
      'Are you sure to delete event?',
      [
        {text: 'No'},
        {
          text: 'Yes', style: 'destructive', 
          onPress: () => {
            eventPermissionRef.update({ [id]: false,});
            const events = this.state.events;
            const index = events.map((e) => e.key).indexOf(id);
            events.splice(index, 1);
            this.setState({ events: events });
          } 
        },
      ],
    );
  }

  render() {
    const { selectedIndex, events } = this.state;
    const buttons = ['Current Events', 'Pending Events', 'Passed Events'];
    const checker = ['current', 'pending', 'passed'];
    const listItem = (l, i) => {
      return <ListItem
        key={i}
        title={l.name}
        subtitle={l.description}
        onPress={() => { this.onSelectEvent(l)} }
        rightTitle={l.status !== 'pending' ? 
          moment(l.finalDate).format('DD/MM/YY') : 
          moment(l.closeDate).format('DD/MM/YY')
        }
        rightTitleStyle={{color: 'black'}}
        hideChevron
      />
    }
    return (
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <ButtonGroup
          textStyle={styles.buttonGroup}
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{height: 25}}
          />
        </View>
        <ScrollView style={{width: '100%'}}>
          <Text style={styles.sectionHeader}>Test</Text>
          <List containerStyle={styles.section}>
            {
              events.filter((event) => { return event.status === checker[selectedIndex]}).map((l) => {
                const swipeoutBtns = [
                  {
                    text: 'Delete',
                    onPress: () => { this.removeEvent(l.key); },
                    backgroundColor: 'red',
                  }
                ];
                return l.status === 'passed' ?
                <Swipeout key={l.key} right={swipeoutBtns} backgroundColor="transparent">
                  {listItem(l, l.key)}
                </Swipeout> :
                listItem(l, l.key)
              })
            }
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  buttonGroup: {
    fontSize: 12,
  },
  section: {
    marginTop: 0,
  },
  sectionHeader: {
    fontSize: 14,
    backgroundColor: 'black',
    marginTop: 10,
    color: 'white',
    paddingLeft: 10,
  },
});