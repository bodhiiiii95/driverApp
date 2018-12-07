import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Button, View, Text } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from 'react-redux';
import LoginApp from './Login/main.js';
import SplashApp from './SplashScreen/splash.js';
import DriverHomeApp from './Main/main_wrapper.js';
import OrderComingApps from './Main/coming_order.js';
import InJob from './inJob/main.js';

class inOrderScreen extends React.Component{
  static navigationOptions = {
      title: 'inOrder',
      header: null,
      gesturesEnabled: false,
    };
  render(){
    return (<InOrder />);
  }
}

class inJob extends React.Component{
  static navigationOptions = {
      title: 'injob',
      header: null,
      gesturesEnabled: false,
    };
  render(){
    return (<InJob />);
  }
}

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
    Job:inJob,
    InOrder: inOrderScreen,
  },
  {
    initialRouteName: 'Splash',
    navigationOptions: {
      swipeEnabled: false
  	},
  }
);

export default class WrapperApp extends React.Component{
	render(){
		return(
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
	}
}

/*---------------------- Redux Area -----------------------*/

const orderState = {
  orderStatus:'0',
  longitude:106.8133446,
  latitude:-6.1222582,
  active:false,
};

const reducer = (state = orderState, action) => {
  switch (action.type){
    case "ORDER":
      state = {
        ...state,
        orderStatus:action.payload
      }
      break;
    case "NO ORDER":
      state = {
        ...state,
        orderStatus:action.payload
      }
      break;
    case "UPDATE LONG":
      state = {
        ...state,
        longitude:action.payload,
      }
      break;
    case "UPDATE LAT":
      state = {
        ...state,
        latitude:action.payload,
      }
      break;
    case "ACTIVE":
      state = {
        ...state,
        active:action.payload,
      }
  }
  return state;
}

const store = createStore(combineReducers({reducer}),
  {},
  applyMiddleware(loggers))

const myLogger = (store) => (next) => (action) =>{
  console.log(action);
  next(action)
}

function loggers({ getState }) {
  return next => action => {
    //console.log('will dispatch', action)
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)
    //console.log('state after dispatch', getState())

    if (action.type == "ORDER"){
      console.log("ini update latitude")
    }
    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

/*--------------------------- Redux Area ------------------------------*/