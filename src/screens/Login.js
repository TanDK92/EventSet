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
    this.signup = this.signup.bind(this);
  }

  async signin() {
    const { email, password } = this.state;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      this.props.navigator.push({
				title: 'Events',
				screen: 'example.Main',
				backButtonHidden: true,
		  });
    } catch (error) {
      console.log(error.toString())
    }
  }

  async signup() {
    this.props.navigator.showModal({
      screen: 'example.Signup',
      title: 'Sign up',
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 2}}>
          <Text style={styles.logoText} >EventSet</Text>
        </View>
        <View style={{flex: 1}}>
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
        <View style={{flex: 1}}>
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
  logoText: {
    fontSize: 50,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '30%', 
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