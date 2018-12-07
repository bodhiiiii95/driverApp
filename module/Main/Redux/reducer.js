import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';
import DriverHomeApp1 from '../main.js'

const orderState = {
  Menu:"mass",
  mega:"megame",
  wibu:"noo",
  Order:false,
};

const mathState = {
  Mana:90
}

export const reducer = (state = orderState, action) => {
  switch (action.type){
    case "ADD ORDER":
      state = {
        ...state,
        Order:action.payload
      }
      break;
    case "DELETE ORDER":
      state = {
        ...state,
        Order:action.payload
      }
      break;
  }
  return state;
}

export const mathReducer = (state = mathState, action) => {
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
