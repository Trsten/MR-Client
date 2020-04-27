import { combineReducers } from 'redux';
import meetingReducer from "./meetingReducer";
import loginReducer from "./loginReducer";
import refDataReducer from './refDataReducer';

const rootReducer = combineReducers({
  userState: loginReducer,
  meetingState: meetingReducer,
  refData: refDataReducer
});

export default rootReducer;