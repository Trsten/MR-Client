import { combineReducers } from 'redux';
import { MEETING_FAILURE,MEETING_LOADING, ADD_MEETING, GET_MEETINGS, GET_MEETING,
     DELETE_MEETING, GET_FILTERED_MEETINGS, MEETING_SUCCESS, UPDATE_MEETING, UPDATE_FAMILY,CLEAR_MEETINGS } from './saga/meetingActions';

const INITIAL_STATE = [];

function meetingOperation(state = INITIAL_STATE, action) {
    console.log("operations")
    switch (action.type) {
        case GET_MEETINGS:
            return action.meetings;
        case ADD_MEETING:
            return [...state,action.meeting]
        case DELETE_MEETING:
            let arr = [...state];
            let meeting = arr.find( ({ id }) => id === action.index.id );

            if ( meeting) {
                if (  meeting.parentId ) {
                    var newArr = arr.filter(function( mt ) {
                            return mt.parentId != meeting.parentId;
                        });
                } else {
                    var newArr = arr.filter(function( mt ) {
                        return mt.parentId != meeting.id;
                      });
                }
             } else {
                 return arr;
             }
            
            let index = newArr.findIndex(x => x.id === action.index.id);
            if (index >= 0) {
                newArr.splice(index, 1);
            }
            return newArr;
        case GET_MEETING: {
            return [action.meeting]
        }
        case UPDATE_MEETING: {
            let newState = [... state];
            const index = newState.findIndex(x => x.id === action.meeting.id);
            
            newState[index] = action.meeting;
            return newState;
        }
        case UPDATE_FAMILY: {
            return [...state]
        }
        case GET_FILTERED_MEETINGS:
            return action.meetings;
        case CLEAR_MEETINGS:
            return [];
        default:
            return state;
    }
}

function meetingFailure(state = null, action) {
    switch(action.type) {
      case MEETING_FAILURE : {
          return action.error;
      }
      default : return state;
    }
  }

function meetingLoading(state = null,action) {
    if(action.type === MEETING_LOADING) {
        return action.isLoading;
    } else {
        return state;
    }
}

function meetingSuccess(state = null, action) {
    if (action.type === MEETING_SUCCESS) {
        return action.success;
    } else {
        return state;
    }
}

const meetingReducer = combineReducers({
    meeting: meetingOperation,
    failMessage: meetingFailure,
    success: meetingSuccess,
    loading: meetingLoading
});

export default meetingReducer;