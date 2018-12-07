import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import AppContainer from './view.js';

const orderState = {
  counter:"bodhi jaya hello",
};

export const mathReducer = (state = orderState, action) => {
  switch (action.type){
    case "MATH ORDER":
      state = {
        ...state,
        Mana:action.payload
      }
      break;
    case "MUTE ORDER":
      state = {
        ...state,
        Mana:action.payload
      }
      break;
  }
  return state;
}

const reducer = (state = orderState, action) => {
	switch (action.type){
	case "ADD ORDER":
	  state = {
	    counter:action.payload
	  }
	  break;
	case "DELETE ORDER":
	  state = {
	    counter:"hapus order"
	  }
	  break;
  	}
  return state;
}

function loggers({ getState }) {
  return next => action => {
    console.log('will dispatch', action)
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)
    console.log('state after dispatch', getState())
    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

const store = createStore(combineReducers({reducer, mathReducer}),
	{},
	applyMiddleware(loggers))

const myLogger = (store) => (next) => (action) =>{
  console.log(action);
  next(action)
}

store.subscribe(() => {
  //console.log(store.getState())
})


class index extends React.Component{
	render(){
		return(
			<Provider store={store}>
				<AppContainer />
			</Provider>
		);
	}
}

export default index;