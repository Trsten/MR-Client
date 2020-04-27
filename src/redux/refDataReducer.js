import { combineReducers } from 'redux';
import { GET_MEETING_STATUS, FAILURE, GET_MEETING_SCHEDULE, GET_ATTENDANT_STATUS, GET_USERS } from './saga/refDataActions';

const INITIAL_STATE = [];

function refDataReducerMeetingSchedule(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_MEETING_SCHEDULE: {
            return action.meetingSchedule;
        }
        default:
            return state;
    }
}

function refDataReducerMeetingState(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_MEETING_STATUS: {
            return action.meetingStatus;
        }
        default:
            return state;
    }
}

function refDataUsers(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_USERS: {
            return action.users;
        }
        default:
            return state;
    }
}

function refDataReducerAttendantStatus(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ATTENDANT_STATUS: {
            return action.attendantStatus;
        }
        default:
            return state;
    }
}

function meetingStatusFailed(state = null, action) {
    switch(action.type) {
      case FAILURE : {
          return action.error;
      }
      default : return state;
    }
  }
  
const refDataReducer = combineReducers({
    meetingSchedule:refDataReducerMeetingSchedule,
    attendantStatus:refDataReducerAttendantStatus,
    meetingState: refDataReducerMeetingState,
    users: refDataUsers,
    failMessage: meetingStatusFailed
});

export default refDataReducer;