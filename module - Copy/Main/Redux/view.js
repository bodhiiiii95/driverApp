import React, { Component } from 'react';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root 
} from 'native-base';
import {ImageBackground, StyleSheet, AsyncStorage, BackHandler} from 'react-native';
import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';
import {Provider} from 'react-redux'
import {reducer, mathReducer} from "./reducer.js"

const mathReducer1 = mathReducer
const reducer1 = reducer

const store = createStore(combineReducers({mathReducer1, reducer1}),
    {},
    applyMiddleware(logger)
);

const middleware = (store) => (next) => (action) =>{
  console.log(action);
  next(action)
}

klik = () => {
	console.log("change name")
}

const mapStateToProps = (dispatch) =>{
	return{
		math: state.mathReducer1,
		reducers: reducer1,
	}
}

export default class App extends React.Component{
	constructor() {
        super();

        this.state={
        	hello:"Hello World"
        }
    }
	render(){
		return(
			<Provider store={store}>
				<Container>
					<Text>{this.state.hello}</Text>
					<Button onPress={() => klik()}><Text>change name</Text></Button>
				</Container>
			</Provider>
		);
	}
}