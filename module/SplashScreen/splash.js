import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import {
  Platform,
  StyleSheet,
  Animated,
  View,
  BackHandler,
  Image, AsyncStorage,
} from 'react-native';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root 
} from 'native-base';
import {connect} from 'react-redux';

var email_driver

class SplashApp1 extends React.Component {

	checkStatus = (email_driver) => {
		fetch('http://10.1.3.166:5000/check_status', {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify({
	      Email: email_driver
	      }),
	    }).then((response) => response.json())
	    .then((responseJson) => {
	    	var status = responseJson.status
	    	var active = responseJson.active
	    	var order = responseJson.order
	    	if(status == 200){
	    		this.props.navigation.navigate('Job')
	    		if(active == 1){
	    			this.props.activeChange(true)
	    		}
	    		else{
	    			this.props.activeChange(false)
	    		}
	    		if(order == 1){
	    			this.props.onOrder('1')
	    		}
	    		else{
	    			this.props.onOrder('1')
	    		}
	    	}
	    	else{
	    		this.props.navigation.navigate('Home')
	    		if(active == 1){
	    			this.props.activeChange(true)
	    		}
	    		else{
	    			this.props.activeChange(false)
	    		}
	    		if(order == 1){
	    			this.props.onOrder('1')
	    		}
	    		else{
	    			this.props.onOrder('1')
	    		}
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

	async getKey(){
	    try{
	      const value = await AsyncStorage.getItem('user', (err, result) => {
	        if(result){
	          let resultParsed = JSON.parse(result)
	          fetch('http://10.1.3.166:5000/driver_login', {
	            method: 'POST',
	            headers: {
	              Accept: 'application/json',
	              'Content-Type': 'application/json',
	            },
	            body:JSON.stringify({
	            EmailLogin: resultParsed.Email,
	            PasswordLogin: resultParsed.Pass,
	            }),
	          }).then((response) => response.json())
	          .then((responseJson) => {
	            var APIresponse = responseJson.status
	            if(APIresponse==300){
	              Toast.show({
	                    text: 'Welcome back',
	                    buttonText: 'Okay',
	                    duration : 7000
	                  })
	              this.checkStatus(resultParsed.Email)
	              
	            }
	            else if(APIresponse==301){
	              	Toast.show({
	                    text: 'Email or password may be invalid',
	                    buttonText: 'Okay',
	                    duration : 4000
	                  })
	              	this.props.navigation.navigate('Login')
	            }
	            else if(APIresponse==310){
		        	Toast.show({
		              text: 'You must activate your ID. Please visit our nearby office',
		              buttonText: 'Okay',
		              duration : 4000
		            })
		        	this.props.navigation.navigate('Login')
		      	}
		      	else if(APIresponse==330){
		        	Toast.show({
		              text: 'Your ID is temporary suspended',
		              buttonText: 'Okay',
		              duration : 4000
		            })
		            this.props.navigation.navigate('Login')
		      	}
		      	else if(APIresponse==340){
		        	Toast.show({
		              text: 'Your ID is permanently banned',
		              buttonText: 'Okay',
		              duration : 4000
		            })
		            this.props.navigation.navigate('Login')
		      	}
		      	else{
		      		console.log(APIresponse)
		      	}
	          }).catch((error) =>{
	              Toast.show({
	                    text: 'Connection Error please restart application',
	                    buttonText: 'Okay',
	                    duration : 4000
	                  })
	            });;
	        }
	        else{
	        	this.props.navigation.navigate('Login')
	        }
	      })
	    } catch(error){
	      console.log(error)
	    }
  	}

	componentWillMount(){
		this.timeoutHandle = setTimeout(()=>{
			this.getKey()
     	}, 100);
	}

	componentWillUnmount(){
		clearTimeout(this.timeoutHandle)
	}

	render(){
		return(
			<Root>
				<Container style = {[styles.container, { backgroundColor: '#000000' }]}>
	            	<Image source={require('./src/img/logo.png')} 
	            	style = {{ width: 200, height: 200 }} />
	        	</Container>
	        </Root>
		);
	}
}

const styles = StyleSheet.create(
{
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: (Platform.OS == 'ios') ? 20 : 0
    },
 
    text:
    {
        color: 'white',
        fontSize: 25
    }
});

const mapStateToProps = (state) =>{
	return{
		active:state.reducer.active,
		orderStatus:state.reducer.orderStatus,
		active:state.reducer.active,
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
		},
		activeChange : (act) =>{
			dispatch({type:'ACTIVE', payload:act})
		}
	}
}

const SplashApp = connect(mapStateToProps, mapDispatchToProps)(SplashApp1);

export default withNavigation(SplashApp);