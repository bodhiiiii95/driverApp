import React, { Component } from 'react';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment, Left, Title, Switch,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root, Footer, Right, FooterTab 
} from 'native-base';
import {ImageBackground, StyleSheet, AsyncStorage, BackHandler, Dimensions,
			View} from 'react-native';
import { withNavigation } from 'react-navigation';
import DriverHomeApp1 from './main.js';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

class Profile1 extends React.Component{

	async removeItemValue(key) {
		try {
			await AsyncStorage.removeItem(key);
			this.props.navigation.navigate('Login')
		}
		catch(exception) {
			console.log(exception)
		}
	}

	render(){
		return(
			<Container>
				<View>
					<Button style={{alignSelf:'center'}} onPress={() => this.removeItemValue('user')}><Text>Log Out</Text></Button>
				</View>
			</Container>
		);
	}
}

export default withNavigation(Profile1);