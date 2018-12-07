import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';



store.dispatch({
  type:"ADD ORDER",
  payload:true
});

store.dispatch({
  type:"DELETE ORDER",
  payload:false
})

store.dispatch({
  type:"MATH ORDER",
  payload:800
})
