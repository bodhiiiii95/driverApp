import React, { Component } from 'react';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment, Switch,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root, Right 
} from 'native-base';
import {ImageBackground, StyleSheet, AsyncStorage, BackHandler, Dimensions,
			View} from 'react-native';
import { withNavigation } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import State from './state.js';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

let resultParsed = ''
let ActiveStatus = '1'
var shareState = require('./state.js')
var interval

class DriverHomeApp1 extends React.Component {
	state={
		latitude: 0,
	    longitude: 0,
	    driverON : false,
	    onOrder:false,
	};

	async getKey(){
	    try{
	      const value = await AsyncStorage.getItem('user', (err, result) => {
		        if(result){
		        	resultParsed = JSON.parse(result)
		        }
		    })
	    } catch(error){
	      console.log(error)
	    }
	}


	getLocationNow = () =>{
		console.log("function runing")
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({latitude:position.coords.latitude}),
				this.setState({longitude:position.coords.longitude})
			},
			(error) => console.log(error.message.toString()),
			{ enableHighAccuracy: false, timeout: 20000, maximumAge:1000 }
		)

	}

	takingOrder(){
		fetch('http://10.1.3.166:5000/update_driver_location', {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify({
	      Email: resultParsed.Email,
	      Longitude: this.state.longitude.toString(),
	      Latidude: this.state.latitude.toString(),
	      Status: ActiveStatus,
	      Order:'1',
	      }),
	    })
	    .then((response) => response.json())
	    .then((responseJson) => {
	    	console.log("fetch 2")
	    })
	    .catch((error) =>{
	        Toast.show({
	              text: 'No internet Connection',
	              buttonText: 'Okay',
	              duration : 7000
	            })
	     });;
		console.log("ada order")
		this.props.navigation.navigate('Order')
	}

	async getCurrentLocation(Active){
		console.log(resultParsed.Email)
		this.setState({driverON:Active})
		Active ? ActiveStatus='1' : ActiveStatus='0'
    	fetch('http://10.1.3.166:5000/update_driver_location', {
    	method: 'POST',
	    headers: {
	      Accept: 'application/json',
	      'Content-Type': 'application/json',
	    },
	    body:JSON.stringify({
	    Email: resultParsed.Email,
	    Longitude: this.state.longitude.toString(),
	    Latidude: this.state.latitude.toString(),
	    Status: ActiveStatus,
	    Order:'0',
	    }),
	    }).then((response) => response.json())
	    .then((responseJson) => {
	    	var status = responseJson.status
	    	if(responseJson.status == 200){
	    		console.log("ada order")
	    		this.props.navigation.navigate('Order')
	    	}
	    	else{
	    		console.log("tidak ada order")
	    	}
	    })
	    .catch((error) =>{
	        Toast.show({
	              text: 'No internet Connection',
	              buttonText: 'Okay',
	              duration : 7000
	            })
	    });;
	}

	componentWillMount(){
		console.log("mainwill mount")
		this.getKey()
		this.getLocationNow()
		State.setState({order:false})
	}

	componentDidMount(){
		this.interval = setInterval(() => this.state.driverON ? this.getCurrentLocation(this.state.driverON) : null, 3000)
		var getLocation = setInterval(() => {
			console.log("getLocation")
			this.getLocationNow()
			if(this.state.latitude != 0 && this.state.longitude !=0){
				clearInterval(getLocation)
			}
			else{
				;
			}
		}, 500)
	}

	componentWillUnmount(){
		console.log("unmount")
	}

	render(){
		return(
			<Container>
				<Header>
					<Right>
						<Switch value={this.state.driverON} 
					          	onValueChange={(value) => this.getCurrentLocation(value)} />
					</Right>
				</Header>      
				<View style={styles.container}>
					<MapView
						style={styles.map}
						region={{
							latitude: this.state.latitude,
							longitude: this.state.longitude,
							latitudeDelta: 0.015,
							longitudeDelta: 0.0121,
						}}
						showsUserLocation={true}
					>
					</MapView>
				</View>
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

export default withNavigation(DriverHomeApp1);