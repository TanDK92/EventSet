import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import {
  Button,
	SocialIcon,
} from 'react-native-elements'
import { auth, database } from '../firebase';

export default class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
	  this.signin = this.signin.bind(this);
    this._handleNavigationRequest = this._handleNavigationRequest.bind(this);
    this.signup = this.signup.bind(this);
  }

  _handleNavigationRequest() {
    this.props.navigator.push({
      title: 'New Event',
      component: CreateEvent,
    })
  }

  async signin() {
    const { email, password } = this.state;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      this.props.navigator.push({
				title: 'Events',
				screen: 'example.EventIndex',
				backButtonHidden: true,
		  });
    } catch (error) {
        console.log(error.toString())
    }
  }

  async signup() {
    const { email, password } = this.state;
    try {
      await auth.createUserWithEmailAndPassword(email, password).then((data) => {
        const user = {
          email: data.email
        }
        database.ref().child('users').child(data.uid).update(user);
      });
      console.log("Account create");
    } catch (error) {
      console.log(error.toString())
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View styke={{flex: 1}}>
          <TextInput
            style={styles.input}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            placeholder="Password"
            secureTextEntry
          />
        </View> 
        <View>
          <Button
            onPress={this.signin}
            buttonStyle={styles.button}
            title='Sign In' 
          />
          <Button
            onPress={this.signup}
            buttonStyle={styles.button}
            title='Sign Up' 
          />
        </View>
				{/*<SocialIcon
					style={styles.button}
					title='Sign In With Facebook'
					button
					type='facebook'
				/>*/}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
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