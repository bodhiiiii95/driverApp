import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Button, View, Text } from 'react-native';
import LoginApp from './Login/main.js';
import SplashApp from './SplashScreen/splash.js';
import DriverHomeApp from './Main/main_wrapper.js'
import OrderComingApps from './Main/coming_order.js'

class OrderScreen extends React.Component{
  static navigationOptions = {
      title: 'Order',
      header: null,
      gesturesEnabled: false,
    };
  render(){
    return (<OrderComingApps />);
  }
}

class SplashScreen extends React.Component{
	static navigationOptions = {
    	title: 'Splash',
    	header: null,
    	gesturesEnabled: false,
  	};
	render(){
		return (<SplashApp />);
	}
}

class HomeScreen extends React.Component{
  static navigationOptions = {
      title: 'Home',
      header: null,
      gesturesEnabled: false,
    };
  render(){
    return (<DriverHomeApp />);
  }
}

class LoginScreen extends React.Component{
	static navigationOptions = {
    	title: 'Login',
    	header: null,
    	gesturesEnabled: false,
  	};
	render(){
		return (<LoginApp />);
	}
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Splash: SplashScreen,
    Login: LoginScreen,
    Order: OrderScreen,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      swipeEnabled: false
  	},
  }
);

export default class WrapperApp extends React.Component{
	render(){
		return <RootStack />;
	}
}
