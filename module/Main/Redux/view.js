import React, { Component } from 'react';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root 
} from 'native-base';
import {ImageBackground, StyleSheet, AsyncStorage, BackHandler} from 'react-native';
import {connect} from 'react-redux';

export class App extends React.Component{
	render(){
		return(
			<Container>
				<Text style={{fontSize:20}}>{this.props.counter}</Text>
				<Button onPress={() => this.props.onAddOrder("Bodhi Jaya Ganteng")}><Text>change your</Text></Button>
			</Container>
		);
	}
	
}

const mapStateToProps = (state) =>{
	return{
		counter: state.reducer.counter,
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		onAddOrder : (name) =>{
			dispatch({type:'ADD ORDER', payload:name})
		} 
	}
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer