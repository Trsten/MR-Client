import { call, put } from 'redux-saga/effects';
import { getMeetingStatus, getMeetingSchedule, getAttendantStatus, refDataFailure, getUsers } from './refDataActions';
import { getAttendantStatusAPI, getMeetingScheduleAPI, getMeetingStatusAPI, getUsersAPI  } from '../../api'
 
function* handleMeetingStatusGet() {  
    console.log("SSSSS");
    const { result, error } = yield call(getMeetingStatusAPI);
    if (result) {
      console.log("AAAAAA");
      yield put(getMeetingStatus(result.data));
    } else {
      if (error.response == null) {
        // handleError(error)
      } else {
        console.log(error.response.headers.message);
        yield put(refDataFailure,(error.response.headers.message));
      }
    }
  }

function* handleMeetingScheduleGet() {  
  console.log("SSSSS");
  const { result, error } = yield call(getMeetingScheduleAPI);
  if (result) {
    console.log("AAAAAA");
    yield put(getMeetingSchedule(result.data));
  } else {
    if (error.response == null) {
      // handleError(error)
    } else {
      console.log(error.response.headers.message);
      yield put(refDataFailure,(error.response.headers.message));
    }
  }
}

function* handleAttendantStatusGet() {  
  console.log("SSSSS");
  const { result, error } = yield call(getAttendantStatusAPI);
  if (result) {
    console.log("AAAAAA");
    yield put(getAttendantStatus(result.data));
  } else {
    if (error.response == null) {
      // handleError(error)
    } else {
      console.log(error.response.headers.message);
      yield put(refDataFailure,(error.response.headers.message));
    }
  }
}

function* handleUsersGet() {  
  console.log("SSSSS");
  const { result, error } = yield call(getUsersAPI);
  if (result) {
    console.log("AAAAAA");
    yield put(getUsers(result.data));
  } else {
    if (error.response == null) {
      // handleError(error)
    } else {
      console.log(error.response.headers.message);
      yield put(refDataFailure,(error.response.headers.message));
    }
  }
}

export {
    handleMeetingStatusGet,
    handleMeetingScheduleGet,
    handleAttendantStatusGet,
    handleUsersGet,
};