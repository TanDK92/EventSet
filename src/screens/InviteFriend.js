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

export default class InviteFriend extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Done', // for a textual button, provide the button title (label)
        id: 'done', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
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
    this.create = this.create.bind(this);
  }

  componentWillMount() {
    const usersRef = database.ref().child('users');
    usersRef.on('value', (snap) => {
      const users = [];
      snap.forEach((child) => {
        if(auth.currentUser.uid !== child.key) {
          const user = child.val();
          user['id'] = child.key;
          users.push(user);
        }
      });
      this.setState({ friends: users });
    });
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'done') { 
        this.create();
      }
    }
  }

  create(){
    const uid = auth.currentUser.uid;
    const data = this.props.data
    const newKey = database.ref().child('events').push().key;
    let updates = {};
    updates['/events/' + newKey] = data;
    updates['/users/' + uid + '/events/' + newKey] = true;
    database.ref().update(updates).then(() => {
      if(this.state.selectedId.length > 0){
        this.state.selectedId.forEach((id) => {
        let up = {};
        up['/events/' + newKey + '/users/' + id] = true;
        up['/users/' + id + '/events/' + newKey] = true;
        database.ref().update(up);
      });
      }
    }).then(() => {
      this.props.navigator.dismissModal({
        animationType: 'slide-down',
      });
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