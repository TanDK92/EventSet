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

export default class MemberList extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Invite', // for a textual button, provide the button title (label)
        id: 'invite', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ]
  };

  render() {
    const { members } = this.props;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.sectionHeader}>Members</Text>
          <List containerStyle={{marginTop: 0}}>
            { members.map((f) => {
              return <ListItem
                key={f.id}
                title={f.email}
                hideChevron
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
    marginTop: 5,
    color: 'white',
    paddingLeft: 10,
  },
});