/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const orderState = {
  Menu:"mass",
  mega:"megame",
  wibu:"noo",
  Order:false,
};

const mathState = {
  Mana:90
}

const reducer = (state = orderState, action) => {
  switch (action.type){
    case "ADD ORDER":
      state = {
        ...state,
        Order:action.payload
      }
      break;
    case "DELETE ORDER":
      state = {
        ...state,
        Order:action.payload
      }
      break;
  }
  return state;
}

const mathReducer = (state = mathState, action) => {
  switch (action.type){
    case "MATH ORDER":
      state = {
        ...state,
        Mana:action.payload
      }
      break;
    case "MUTE ORDER":
      state = {
        ...state,
        Mana:action.payload
      }
      break;
  }
  return state;
}

const store = createStore(combineReducers({mathReducer, reducer}),
    {},
    applyMiddleware(logger)
);

const middleware = (store) => (next) => (action) =>{
  console.log(action);
  next(action)
}

store.subscribe(() => {
  //console.log(store.getState())
})

store.dispatch({
  type:"ADD ORDER",
  payload:true
});

store.dispatch({
  type:"DELETE ORDER",
  payload:false
})

store.dispatch({
  type:"MATH ORDER",
  payload:800
})

type Props = {};
export default class App extends Component<Props> {
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
