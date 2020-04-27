import { combineReducers } from 'redux';
import { LOGGED_USER, IS_LOGGED, LOGIN_FAILED, LOGOUT} from './saga/loginActions';

const INITIAL_STATE = [];

const applyUserLogin = (state, action) =>
    action.user;

const applyLogin = (state, action) =>
    action.isLogged

function doLoginReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LOGGED_USER : {
        return applyUserLogin(state, action);
    }
    case LOGOUT : {
      localStorage.clear();
      return applyUserLogin(state, action);
  }
    default : return state;
  }
}

function isLoggedReducer(state = false, action) {
  switch(action.type) {
    case IS_LOGGED : {
        return applyLogin(state, action);
    }
    case LOGOUT : {
      return false;
  }
    default : return state;
  }
}

function loginFailed(state = null, action) {
  switch(action.type) {
    case LOGIN_FAILED : {
        return action.error;
    }
    default : return state;
  }
}

const loginReducer = combineReducers({
    user:doLoginReducer,
    isLogged:isLoggedReducer,
    failMessage:loginFailed
});

export default loginReducer;