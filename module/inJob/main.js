import React, { Component } from 'react';
import { Platform,StyleSheet,BackHandler, Image, View,
          TouchableOpacity, Dimensions, AsyncStorage, PanResponder, Animated} from 'react-native';
import { Container, Header, Content, Footer, Toast,
         FooterTab, Button, Text, InputGroup, Input, Left, Right,
     	 Card, CardItem, Body, H1, Icon, Title} from 'native-base';
import { withNavigation } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import {connect} from 'react-redux';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

let resultParsed = '';
let User = ''
let price = ''
latitude = 0
longitude = 0
var width = 100
let height = 100
let buttonText =""
const endTrip = null
class InJob1 extends React.Component{

	constructor (props) {
        super(props);
        this.getOrder = this.getOrder.bind(this);
        this.state={
			userLong:0,
			userLat:0,
			destLong:0,
			destLat:0,
			finishOrder:0,
			buttonWidth:0,
			buttonHeight:0,
			marginLeft:0,
			pan:new Animated.ValueXY(),
			orderStatus:undefined,
			buttonText:'',
			userMail:'',
			userPosLat:0,
			userPosLong:0,
			inOrder:0,
		}

		this._panResponder=PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: () => true,

	        // Initially, set the value of x and y to 0 (the center of the screen)
		    onPanResponderGrant: (e, gestureState) => {
		    	this.state.pan.setOffset({x: this.state.pan.x._value});
  				this.state.pan.setValue({x: 0, y: 0});
		    },
		    /*onMoveShouldSetPanResponderCapture: (e, { dx }) => {
			    // This will make it so the gesture is ignored if it's only short (like a tap).
			    // You could also use moveX to restrict the gesture to the sides of the screen.
			    // Something like: moveX <= 50 || moveX >= screenWidth - 50
			    // (See https://facebook.github.io/react-native/docs/panresponder)
			    this.state.pan.setOffset({x: this.state.pan.x._value});
  				this.state.pan.setValue({x: 0, y: 0});
			    return Math.abs(dx) > 20;
			  },*/

		    // When we drag/pan the object, set the delate to the states pan position
		    onPanResponderMove:(e, gestureState) =>(
		    	Math.abs(gestureState.dx) > 30 ? null :
		    	Animated.event([null, {dx: this.state.pan.x}])(e,gestureState)
		    	), 

		    onPanResponderRelease: (e, {vx}) => {
		    	this.state.pan.flattenOffset();
		    },

		})
    }

	async getKey(){
	    try{
	      const value = await AsyncStorage.getItem('user', (err, result) => {
		        if(result){
		        	resultParsed = JSON.parse(result)
		        	this.getOrder('1')
		        }
		        else{
		        	console.log("tidak ada")
	        		this.props.navigation.navigate('Login')
	        	}
		    })
	    } catch(error){
	      console.log(error)
	    }
	}

	endOrder = () => {
		fetch('http://10.1.3.166:5000/end_order', {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify({
	      Email: resultParsed.Email,
	      UserMail : this.state.userMail,
	      userLong : this.state.userLong,
	      userLat : this.state.userLat,
	      destLong : this.state.destLong,
	      destLat : this.state.destLat,
	      price : price
	      }),
	    }).then((response) => response.json())
	    .then((responseJson) => {
	    	this.props.navigation.navigate('Home')
	    	this.setState({inOrder:0})
	    	this.props.onOrder('0')
	    })
	    .catch((error) =>{
	        Toast.show({
              text: 'No internet Connection',
              buttonText: 'Okay',
              duration : 7000
            })
	    });;
	}

	getUserPos = () => {
		fetch('http://10.1.3.166:5000/user_pos', {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify({
	      Email: resultParsed.Email
	      }),
	    }).then((response) => response.json())
	    .then((responseJson) => {
    		this.setState({userPosLat:responseJson.latitude})
    		this.setState({userPosLong:responseJson.longitude})
    		console.log(this.state.user_lat)
	    })
	    .catch((error) =>{
	        Toast.show({
	              text: 'No internet Connection',
	              buttonText: 'Okay',
	              duration : 7000
	            })
	      });;
	}

	//action value = {1 = get status, 2 = update status}
	getOrder = (actionValue) => {
		console.log(actionValue)
		fetch('http://10.1.3.166:5000/get_order', {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify({
	      Email: resultParsed.Email,
	      Action: actionValue
	      }),
	    }).then((response) => response.json())
	    .then((responseJson) => {
	    	if(responseJson.status == '404'){
	    		;
	    	}
	    	else{
	    		User = responseJson.user
	    		this.setState({userMail:responseJson.usermail})
		    	this.setState({userLong:responseJson.userlong})
		    	this.setState({userLat:responseJson.userlat})
		    	this.setState({destLong:responseJson.deslong})
		    	this.setState({destLat:responseJson.deslat})
		    	price = responseJson.price
		    	console.log(parseInt(responseJson.status))
		    	this.setState({orderStatus:responseJson.status},() =>{
		    		if(this.state.orderStatus == '1'){
		    			this.setState({buttonText:'Start Trip'})
		    		}
		    		else{
		    			this.setState({buttonText:'End Trip'})
		    		}
		    	})
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

	doNothing = () => {

	}

	componentWillMount(){
		this.setState({inOrder:1})
		this.getKey()
	}

	componentDidMount(){
		var getLocation = setInterval(() => {
			if(this.state.inOrder == 1){
				this.getUserPos()
			}
			else{
				this.doNothing()
			}
		}, 2000)
	}

	render(){
		let { pan } = this.state;

		// Calculate the x transform from the pan value
		let [translateX] = [pan.x];

		// Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
		let imageStyle = {transform: [{translateX}]};
		return(
				<Container>
					<View style={styles.container}>
						<Header>
							<Left>
					        	<Button transparent>
					        		<Icon name='menu' />
					        	</Button>
				        	</Left>
				        	<Body>
				        		<Title>Header</Title>
				        	</Body>
				        	<Right />
				         </Header>
				         {	this.state.userLat && this.state.userLong ?
				         	<MapView
								style={styles.map}
								region={{
									latitude: this.state.userLat,
									longitude: this.state.userLong,
									latitudeDelta: 0.015,
									longitudeDelta: 0.0121,
									}}
								showsUserLocation={true}
								rotateEnabled={true}
								scrollEnabled={true}
							>
							<Marker
							  coordinate= {{latitude:this.state.userLat, longitude:this.state.userLong}}
							  image={require('./src/image/dot.png')}/>
							  <Marker
							  coordinate= {{latitude:this.state.destLat, longitude:this.state.destLong}}
							  image={require('./src/image/dot.png')}/>
							  <Marker
							  coordinate= {{latitude:this.state.userPosLat, longitude:this.state.userPosLong}}/>
							</MapView>
							:
							<Text>Get Order</Text>
				         }
							
						<View style={styles.orderStatus} onLayout={event =>{
							width=event.nativeEvent.layout.width
							this.setState({buttonHeight:event.nativeEvent.layout.height / 3})
							this.setState({buttonWidth:event.nativeEvent.layout.width / 4})
						}}>
							<View>
							<Text>{User}</Text>
							</View>
								{
									this.state.buttonHeight && this.state.buttonWidth ?
									(
										this.state.orderStatus ? 
										(
											this.state.orderStatus == '1' ?
											<View  style={{backgroundColor:'aqua',
															width:width,
															height:this.state.buttonHeight,}}>
													<TouchableOpacity onPress={() => this.getOrder('2')}><Text>{this.state.buttonText}</Text></TouchableOpacity>
											</View>
											:
											<View  style={{backgroundColor:'aqua',
															width:width,
															height:this.state.buttonHeight,}}>
													<TouchableOpacity onPress={() => this.endOrder()}><Text>{this.state.buttonText}</Text></TouchableOpacity>
											</View>
										)
										:
										<Text>{this.state.orderStatus}</Text>
									)
									:
									<Text>loading</Text>
									
								}
								
							
						</View>
					</View>
				</Container>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent:'flex-start',
	},
	header:{
		alignContent:'flex-end'
	},
	map:{
		flex:0.7,
		backgroundColor:'red',
	},
	orderStatus:{
		flex:0.3,
		backgroundColor:'white',
		justifyContent:'space-evenly',
		alignItems:'center',
	},
	Detail:{

	},
	buttonTrip:{
		backgroundColor:'aqua'
	},
})

const mapStateToProps = (state) =>{
	return{
		latitude:state.reducer.latitude,
		longitude:state.reducer.longitude,
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		changeLatLong : (lati, longi) =>{
			dispatch({type:'UPDATE LONG', payload:longi}),
			dispatch({type:'UPDATE LAT', payload:lati})
		},
		onOrder : (name) =>{
			dispatch({type:'ORDER', payload:name})
		}
	}
}

const InJob = connect(mapStateToProps, mapDispatchToProps)(InJob1);

export default withNavigation(InJob);