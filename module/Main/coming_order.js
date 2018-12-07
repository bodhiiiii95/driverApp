import React, { Component } from 'react';
import { Platform,StyleSheet,BackHandler, Image, View,
          TouchableHighlight, Dimensions, AsyncStorage} from 'react-native';
import { Container, Header, Content, Footer, Toast,
         FooterTab, Button, Text, InputGroup, Input, List, ListItem,
     	 Card, CardItem, Body, H1} from 'native-base';
import { withNavigation } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import {connect} from 'react-redux';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height
let userLong = 0
let userLat = 0
let destLong = 0
let destLat = 0
var timeout = ""

class OrderComingApps1 extends React.Component{

	state={
		latitude: 0,
	    longitude: 0,
	    destLat:0,
	    destLong:0,
	    user_email:'',
	    price:'',
	    driverON : false,
	    onOrder:false,
	    accept:false,
	};

	async getNearbyDriver(){
		try{
			const value = await AsyncStorage.getItem('user', (err, result) => {
				if(result){
					let resultParsed = JSON.parse(result)
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
				      Status: '1',
				      Order:'1',
				      }),
				    }).then((response) => response.json())
				    .then((responseJson) => {
				    	var status = responseJson.status
				    	if(status==200){
				    		this.setState({user_email:responseJson.user_email})
				    		this.setState({latitude:responseJson.user_lat})
				    		this.setState({longitude:responseJson.user_long})
				    		this.setState({destLat:responseJson.dest_lat})
				    		this.setState({destLong:responseJson.dest_long})
				    		this.setState({price:responseJson.price})
				    	}
				    	else{
				    		console.log("udah tau ada order, masih ngaco")
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
			})
		}
		catch(error){
			console.log(error)
		}
	}

	async cancelOrder(){
		this.setState({accept:false})
		try{
			const value = await AsyncStorage.getItem('user', (err, result) => {
				if(result){
					let resultParsed = JSON.parse(result)
					fetch('http://10.1.3.166:5000/order_cancel', {
				      method: 'POST',
				      headers: {
				        Accept: 'application/json',
				        'Content-Type': 'application/json',
				      },
				      body:JSON.stringify({
				      Email: resultParsed.Email,
				      UserEmail : this.state.user_email.toString(),
				      Longitude: this.state.longitude.toString(),
				      Latitude: this.state.latitude.toString(),
				      DestLong : this.state.destLong.toString(),
				      DestLat : this.state.destLat.toString(),
				      Price : this.state.price.toString(),
				      Order: 0,
				      }),
				    }).then((response) => response.json())
				    .then((responseJson) => {
				    	console.log("cancel order")
				    	this.props.onOrder('0')
				    	this.props.navigation.navigate('Home')
				    	var status = responseJson.status
				    	if(status==501){

				    	}
				    	else{
				    		console.log("udah tau ada order, masih ngaco")
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
			})
		}
		catch(error){
			console.log(error)
		}
		
	}

	async acceptOrder(){
			try{
				const value = await AsyncStorage.getItem('user', (err, result) => {
					if(result){
						let resultParsed = JSON.parse(result)
						fetch('http://10.1.3.166:5000/order_accepted', {
					      method: 'POST',
					      headers: {
					        Accept: 'application/json',
					        'Content-Type': 'application/json',
					      },
					      body:JSON.stringify({
					      Email: resultParsed.Email,
					      UserEmail : this.state.user_email.toString(),
					      Longitude: this.state.longitude.toString(),
					      Latitude: this.state.latitude.toString(),
					      DestLong : this.state.destLong.toString(),
					      DestLat : this.state.destLat.toString(),
					      Price : this.state.price.toString(),
					      Status: 1,
					      Order : this.props.orderStatus,
					      }),
					    }).then((response) => response.json())
					    .then((responseJson) => {
					    	var status = responseJson.status
					    	this.props.navigation.navigate('Job')
					    	if(status==501){
				    		
					    	}
					    	else{
					    		console.log("udah tau ada order, masih ngaco")
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
				}
			)}
			catch(error){
				console.log(error)
			}
	}

	componentWillMount(){
		this.getNearbyDriver()
	}

	testfunc = () =>{
		clearInterval(timeout)
		this.acceptOrder()
	}

	componentDidMount(){
		timeout = this.interval = setInterval(() => {
					this.cancelOrder()
					clearInterval(timeout)
				}, 10000)
		/*State.setState({order:true}, () => {
			State.state.order ? 
				timeout = this.interval = setInterval(() => {
					this.cancelOrder()
				}, 15000)
			 :
			clearInterval(timeout);
		})*/
		
		
	}

	render(){
		return(
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
					rotateEnabled={true}
					scrollEnabled={true}
				>
				<Marker
				  coordinate= {{latitude:this.state.latitude, longitude:this.state.longitude}}
				  image={require('./src/image/dot.png')}/>
				  <Marker
				  coordinate= {{latitude:this.state.destLat, longitude:this.state.destLong}}
				  image={require('./src/image/dot.png')}/>
				</MapView>
				<View style={styles.cardContainer}>
					<Card style={styles.card}>
			            <CardItem style={styles.cardItem}>
			              <Body>
			                <Button style={styles.confirmButton} onPress={() => this.testfunc()}><Text>Accept Order</Text></Button>
			              </Body>
			            </CardItem>
			        </Card>
		        </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		height: height,
		width: width,
		justifyContent: 'flex-end',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	cardContainer:{
		position:'relative',
		height:height/2,
		width:width,
		justifyContent: 'flex-end',
	},
	card:{
		flex:0.5,
	},
	cardItem:{
		flex:1,
		justifyContent:'center',
		backgroundColor: '#000000',
	},
	confirmButton:{
		alignSelf:'center',
		flex:1,
		flexDirection:'row',

	}
})

const mapStateToProps = (state) =>{
	return{
		orderStatus: state.reducer.orderStatus,
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		onOrder : (name) =>{
			dispatch({type:'ORDER', payload:name})
		}
	}
}

const OrderComingApps = connect(mapStateToProps, mapDispatchToProps)(OrderComingApps1);

export default withNavigation(OrderComingApps);