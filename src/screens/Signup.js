import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  AlertIOS,
} from 'react-native';
import {
  List, ListItem,
} from 'react-native-elements'
import { auth, database } from '../firebase';

export default class Login extends Component {
  static navigatorButtons = {
    leftButtons: [
      {
        title: 'Cancel', // for a textual button, provide the button title (label)
        id: 'cancel', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      },
    ],
  };
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPass: '',
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.signup = this.signup.bind(this);
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'cancel') { 
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      }
    }
  }

  async signup() {
    const { email, password, confirmPass } = this.state;
    if(password !== confirmPass){
      AlertIOS.alert(
        'Password not matched',
      );
    } else {
      try {
        await auth.createUserWithEmailAndPassword(email, password).then((data) => {
          const user = {
            email: data.email
          }
          database.ref().child('users').child(data.uid).update(user);
        });
        this.props.navigator.push({
          title: 'Events',
          screen: 'example.Main',
          backButtonHidden: true,
        });
      } catch (error) {
        console.log(error.toString())
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <List>
            <ListItem 
              textInput
              textInputOnChangeText={(text) => {this.setState({email: text});}}
              textInputValue={this.state.email}
              title='Email'
              hideChevron
            />
            <ListItem 
              textInput
              textInputSecure
              textInputOnChangeText={(text) => {this.setState({password: text});}}
              textInputValue={this.state.password}
              title='Password'
              hideChevron
            />
            <ListItem 
              textInput
              textInputSecure
              textInputOnChangeText={(text) => {this.setState({confirmPass: text});}}
              textInputValue={this.state.confirmPass}
              title='Confirm password'
              hideChevron
            />
          </List>
        </View> 
        <View style={{flex: 1}}>
          <View style={{backgroundColor: "white", borderColor: 'gray', borderWidth: 0.5}}>
            <Button
              onPress={this.signup}
              buttonStyle={styles.button}
              title='Sign Up' 
            />
          </View>
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
    width: '80%', 
    borderColor: 'gray', 
    borderWidth: 1,
    marginBottom: 20,
    marginLeft: '10%',
    paddingLeft: 5,
  },
	button: {
		width: '70%',
    marginBottom: 10,
    marginLeft: '15%',
	}
});