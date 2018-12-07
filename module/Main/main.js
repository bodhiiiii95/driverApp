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
import {connect} from 'react-redux';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

var resultParsed
let ActiveStatus = '1'
let longitudes = 0
let latitudes = 0
var interval

class DriverHomeApp extends React.Component {
	state={
		latitude:0,
		longitude:0,
	    driverON : false,
	    onOrder:false,
	};

	async getKey(){
	    try{
	      const value = await AsyncStorage.getItem('user', (err, result) => {
		        if(result){
		        	resultParsed = JSON.parse(result)
		        }
		        else{
	        		this.props.navigation.navigate('Login')
	        	}
		    })
	    } catch(error){
	      console.log(error)
	    }
	}


	getLocationNow = () =>{
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({latitude:position.coords.latitude})
				this.setState({longitude:position.coords.longitude})
				this.props.changeLatLong(position.coords.longitude, position.coords.longitude)
			},
			(error) => console.log(error.message.toString()),
			{ enableHighAccuracy: false, timeout: 20000, maximumAge:1000 }
		)

	}

	async getCurrentLocation(Active){
		this.getLocationNow()
		console.log(this.props.active)
		this.props.activeChange(Active)
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
	    Order:this.props.orderStatus,
	    }),
	    }).then((response) => response.json())
	    .then((responseJson) => {
	    	var status = responseJson.status
	    	this.props.changeLatLong(this.state.latitude.toString(), this.state.longitude.toString())
	    	if(responseJson.status == 200){
	    		this.props.onOrder('1')
	    		this.props.navigation.navigate('Order')
	    	}
	    	else{
	    		console.log("tidak order")
	    	}
	    })
	    .catch((error) =>{
	    	console.log("error")
	        Toast.show({
	              text: 'No internet Connection',
	              buttonText: 'Okay',
	              duration : 7000
	            })
	    });;
	}

	componentWillMount(){
		this.getKey()
	}

	componentDidMount(){
		var getLocation = setInterval(() => {
			this.getLocationNow()
			if(this.state.latitude != 0 && this.state.longitude !=0){
				clearInterval(getLocation)
				this.interval = setInterval(() => this.props.active ? this.getCurrentLocation(this.props.active) : null, 3000)
			}
			else{
				;
			}
		}, 500)
	}

	componentWillUnmount(){
		var getLocation = setInterval(() => {
			this.getLocationNow()
			if(this.state.latitude != 0 && this.state.longitude !=0){
				clearInterval(getLocation)
				this.interval = setInterval(() => this.props.active ? this.getCurrentLocation(this.props.active) : null, 3000)
			}
			else{
				;
			}
		}, 500)
	}

	render(){
		return(
			<Container>
				<Header>
					<Right>
						<Switch value={this.props.active} 
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

const mapStateToProps = (state) =>{
	return{
		orderStatus:state.reducer.orderStatus,
		latitude:state.reducer.latitude,
		longitude:state.reducer.longitude,
		active:state.reducer.active,
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		onOrder : (name) =>{
			dispatch({type:'ORDER', payload:name})
		},
		changeLatLong : (lati, longi) =>{
			dispatch({type:'UPDATE LONG', payload:longi}),
			dispatch({type:'UPDATE LAT', payload:lati})
		},
		activeChange : (act) =>{
			dispatch({type:'ACTIVE', payload:act})
		}
	}
}

const DriverHomeApp1 = connect(mapStateToProps, mapDispatchToProps)(DriverHomeApp);

export default withNavigation(DriverHomeApp1);