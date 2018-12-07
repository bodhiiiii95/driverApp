import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';
import {reducer, mathReducer} from "./reducer.js"

const mathReducer1 = mathReducer
const reducer1 = reducer

store.dispatch({
    type:"ADD ORDER",
    payload:true
  });