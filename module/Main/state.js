import React, { Component } from 'react';
import { Platform,StyleSheet,BackHandler, Image, View,
          TouchableHighlight, Dimensions, AsyncStorage} from 'react-native';


var status

class state extends React.Component{
	state={
		order:false
	};

	changeOrder(status){
		this.setState({order:status}, () =>{
			
		})
		return status
	}
}

const State = new state();
export default State;