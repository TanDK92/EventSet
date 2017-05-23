import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
} from 'react-native';
import {
  List, ListItem, ButtonGroup
} from 'react-native-elements'
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
        eIds.push(child.key);
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
      // navigateData.onRightButtonPress =  this._handleNavigationRequest();
    }
    // this.props.navigator.toggleTabs({
    //   to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
    // });
    this.props.navigator.push(navigateData);
  }

  render() {
    const { selectedIndex, events } = this.state;
    const buttons = ['Current Events', 'Pending Events', 'Passed Events'];
    const checker = ['current', 'pending', 'passed'];
    
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
        <View style={{width: '100%'}}>
          <Text style={styles.sectionHeader}>Test</Text>
          <List containerStyle={styles.section}>
            {
              events.filter((event) => { return event.status === checker[selectedIndex]}).map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  subtitle={l.description}
                  onPress={() => { this.onSelectEvent(l)} }
                  hideChevron
                />
              ))
            }
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