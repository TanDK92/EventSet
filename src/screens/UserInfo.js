import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import {
  List, ListItem
} from 'react-native-elements'
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
    const { user } = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 10}}>
          <Text style={styles.sectionHeader}>User Information</Text>
          <List containerStyle={styles.section}>
            <ListItem
                title="Email"
                rightTitle={user.email}
                rightTitleStyle={{color: 'black'}}
                hideChevron
              />
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
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
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