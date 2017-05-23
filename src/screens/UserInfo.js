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
import { auth, database } from '../firebase';

export default class UserInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
    }
  }

  componentWillMount() {
    const user = database.ref().child('users').child(auth.currentUser.uid)
    user.on('value', (snap) => {
      this.setState({user: snap.val()});
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 10, paddingLeft: 10, paddingRight: 10}}>
            <Text style={styles.titleText}>{this.state.user.email}</Text>
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