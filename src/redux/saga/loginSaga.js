import { call, put } from 'redux-saga/effects';
import { getLoggedUser, isLogged, loginFailed } from './loginActions';
import { loginUser } from '../../api';
// import { handleError } from "../handleError"


function* handleLoginUser(user) {  
  const { result, error } = yield call(loginUser, user);
  if (result) {
    yield put(getLoggedUser(result.data));
    yield put(isLogged(true))
    yield put(loginFailed(null));
  } else {
    if (error.response == null) {
      // handleError(error)
    } else {
      console.log(error.response.headers.message);
      yield put(loginFailed(error.response.headers.message));
    }
  }
}

export {
  handleLoginUser
};