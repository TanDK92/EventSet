import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import {
    List, ListItem, CheckBox
} from 'react-native-elements';
import { auth, database } from '../firebase';

export default class AddMoreFriends extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Add', // for a textual button, provide the button title (label)
        id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ],
    leftButtons: [
      {
        title: 'Cancel', // for a textual button, provide the button title (label)
        id: 'cancel', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      selectedId: [],
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.add = this.add.bind(this);
    this.usersRef = database.ref().child('users');
  }

  componentWillMount() {
    this.usersRef.on('value', (snap) => {
      const users = [];
      snap.forEach((child) => {
        if(!this.props.oldMember.map((mem) => {return mem.id;}).includes(child.key)) {
          const user = child.val();
          user['id'] = child.key;
          users.push(user);
        }
      });
      this.setState({ friends: users });
    });
  }

  componentWillUnmount() {
    this.usersRef.off();
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'add') { 
        this.add();
      }
      if (event.id === 'cancel') { 
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      }
    }
  }

  add(){
    const { eventId } = this.props;
    if(this.state.selectedId.length > 0){
      this.state.selectedId.forEach((id) => {
        let updates = {};
        updates['/events/' + eventId + '/users/' + id] = true;
        updates['/users/' + id + '/events/' + eventId] = true;
        database.ref().update(updates);
      });
    }
    this.props.navigator.dismissModal({
      animationType: 'slide-down',
    });
  }

  onValueChange(value){
    this.setState({switchValue: value});
  }

  onSelect(id) {
    const selected = this.state.selectedId;
    if(selected.includes(id)) {
      const index = selected.indexOf(id);
      selected.splice(index, 1);
    } else {
      selected.push(id);
    }
    this.setState({ selectedId: selected });
  }

  render() {
    const { friends, selectedId } = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Select friends</Text>
          <List containerStyle={{marginTop: 0}}>
            { friends.map((f) => {
              return <CheckBox
                key={f.id}
                title={f.email}
                checked={selectedId.includes(f.id)}
                onPress={() => {this.onSelect(f.id)}}
              />
            })}
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