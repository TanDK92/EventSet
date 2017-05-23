import React, { Component } from 'react';
import {
  StyleSheet,
  TabBarIOS,
} from 'react-native';
import EventIndex from './EventIndex';
import UserInfo from './UserInfo';

export default class Main extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'New', // for a textual button, provide the button title (label)
        id: 'new', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ]
  };

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 0,
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
  render() {
    const { selectedTab } = this.state;
    return (
        <TabBarIOS 
          unselectedTintColor="gray"
          tintColor="blue"
          unselectedItemTintColor="gray"
          barTintColor="white">
          <TabBarIOS.Item
            title="Events"
            icon={require('../../img/list.png')}
            selected={selectedTab === 0}
            onPress={() => {
              this.setState({
                selectedTab: 0,
              });
            }}>
            <EventIndex />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title="Profile"
            icon={require('../../img/edit.png')}
            selected={selectedTab === 1}
            onPress={() => {
              this.setState({
                selectedTab: 1,
              });
            }}>
            <UserInfo />
          </TabBarIOS.Item>
        </TabBarIOS>
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