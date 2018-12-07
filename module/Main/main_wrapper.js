import React, { Component } from 'react';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment, Left, Title, Switch,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root, Footer, Right, FooterTab 
} from 'native-base';
import {ImageBackground, StyleSheet, AsyncStorage, BackHandler, Dimensions,
			View} from 'react-native';
import { withNavigation } from 'react-navigation';
import DriverHomeApp1 from './main.js';
import Profile1 from './profile.js'

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height
var select

class DriverHomeApp extends React.Component {
	state={
		selectedTab:'home',
		switchValue:false,
	};

	renderSelectedTab(select){

		this.setState({selectedTab:select}, () => {
			switch (this.state.selectedTab){
			case 'home':
				return (<DriverHomeApp1 />);
				break;
			case 'revenue':
				return (<Text>Revenue</Text>);
				break;
			case 'profile':
				return (<Text>Profile</Text>);
				break;
			case 'contact':
				return (<Text>Contact</Text>);
				break;
			}
		})
	}

	componentDidMount(){
		
	}

	render(){
		return(
			<Container>
				<Header hasTabs>
		          <Left/>
		          <Body>
		            <Title>Header</Title>
		          </Body>
		        </Header>
		        <Tabs tabBarPosition="bottom">
				    <Tab heading="Map">
		            	<DriverHomeApp1 />
		          	</Tab>
		          	<Tab heading="Revenue">
		            	<Text>Revenue</Text>
		          	</Tab>
		          	<Tab heading="Profile">
		            	<Profile1 />
		          	</Tab>
		          	<Tab heading="Contact">
		            	<Text>Contact</Text>
		          	</Tab>
			    </Tabs>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		height: height,
		width: width,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
})

export default withNavigation(DriverHomeApp);