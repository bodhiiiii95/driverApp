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

class SplashApp extends React.Component {

	async getKey(){
	    try{
	      const value = await AsyncStorage.getItem('user', (err, result) => {
	        if(result){
	          let resultParsed = JSON.parse(result)
	          console.log(resultParsed.Email)
	          console.log(resultParsed.Pass)
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
	              this.props.navigation.navigate('Home')
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
     	}, 3000);
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

export default withNavigation(SplashApp);