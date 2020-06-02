import { call, put } from 'redux-saga/effects';
import { meetingFailure, meetingLoading,addMeeting, meetingSuccess, getMeeting, updateMeeting ,deleteMeeting, getFilteredMeetings } from './meetingActions';
import { getMeetingAPI, createMeetingAPI, getFilteredMeetingsAPI, updateMeetingAPI, deleteMeetingAPI, updateFamilyMeetingsAPI } from '../../api';
import { fileDelete,getFilesInfo  } from '../../uploadApi';

const addDate = (date,meeting) => {
  if ( meeting.meetingScheduleId === 51) {
    date.setDate(date.getDate() + 7 );
  } else {
    date.setMonth(date.getMonth() + 1 );
  }
  return date;
}

function* handleDeleteMeeting(index) {
  let filesToDelete = {
    entityId: index.index.id,
    entityDate: new Date().toISOString().substring(0,10),
    directory: "",
    fileDataList: index.index.files
  }
  yield put(meetingLoading(true));
  delete index.index.files;
  const { result, error } = yield call(deleteMeetingAPI, index);
  if (result) {
    if (index.index.delChildrens) {
      //odstranujem subory pre vsetky meetingy ktore sa opakuju
      while (result.data.length > 0 ) {
        filesToDelete.entityId = result.data[0];
        filesToDelete.fileDataList = [];
        const response = yield call (getFilesInfo , filesToDelete);
        yield call(fileDelete, response.result.data);
        result.data.shift();
      }      
    } else {
      yield call(fileDelete ,filesToDelete);
    }
    yield put(meetingSuccess("delete"));
    yield put(deleteMeeting(index.index));
  } else {
    if (error.response == null) {
      yield put(meetingFailure('no response'));
    } else {
      yield put(meetingFailure(error.response.headers.message));
    }
  }
  yield put(meetingLoading(false)); 
}

function* handleMeetingGet(index) {  
  console.log("handle meetings");
  const { result, error } = yield call(getMeetingAPI, index);
  if (result) {
    console.log("successful");
    yield put(getMeeting(result.data));
  } else {
    if (error.response == null) {
      yield put(meetingFailure('no response'));
    } else {
    yield put(meetingFailure(error.response.headers.message));
    }
  }
}

function* handleFilteredMeetings(filter) {  
  const { result, error } = yield call(getFilteredMeetingsAPI, filter);
  if (result) {
    console.log("successful");
    yield put(getFilteredMeetings(result.data));
  } else {
    if (error.response == null) {
      yield put(meetingFailure('no response'));
    } else {
    yield put(meetingFailure(error.response.headers.message));
    }
  }
}

function* handleMeetingAdd(meeting) {  
  console.log("handle meeting add");
  yield put(meetingLoading(true));
  const { result, error } = yield call(createMeetingAPI, meeting);
  yield put(meetingFailure(null));
  if (result) {
    if( meeting.meeting.meetingScheduleId != 50) {
      let date = new Date(meeting.meeting.date.valueOf());

      meeting.meeting.endDate.setHours(23,59,59,0);
      while ( addDate(date,meeting.meeting)  <= meeting.meeting.endDate) {
          meeting.meeting = {...meeting.meeting,
            date: date,
            parentId: result.data.id
            };
           yield call(createMeetingAPI, meeting);
        }
      } else {
        yield put(addMeeting(result.data));
      }    
    yield put(meetingSuccess('succes'));
  } else {
    if (error.response == null) {
      yield put(meetingFailure('no response'));
    } else {
      yield put(meetingFailure(error.response.headers.message));
    }
  }
  yield put(meetingLoading(false));
}

function* handleUpdateMeeting(newData) {
  yield put(meetingLoading(true));  
  const { result, error } = yield call(updateMeetingAPI, newData);
  if (result) {
    yield put(meetingSuccess("update"));
    yield put(updateMeeting(result)); 
  } else {
    if (error.response == null) {
      yield put(meetingFailure('no response'));
    } else {
      yield put(meetingFailure(error.response.headers.message));
    }
  }
  yield put(meetingLoading(false)); 
}

//update parent meeting a vsetky jeho children
function* handleUpdateFamily(newData) {
  yield put(meetingLoading(true));  
  const { result, error } = yield call(updateFamilyMeetingsAPI, newData);
  if (result) {
    yield put(meetingSuccess("update"));
    yield put(updateMeeting(newData)); 
  } else {
    if (error.response == null) {
      yield put(meetingFailure('no response'));
    } else {
      yield put(meetingFailure(error.response.headers.message));
    }
  }
  yield put(meetingLoading(false)); 
}

function* handleClearResponse() {
  yield put(meetingSuccess(null));
  yield put (meetingFailure(null));
}

export {
    handleMeetingGet,
    handleMeetingAdd,
    handleFilteredMeetings,
    handleUpdateMeeting,
    handleClearResponse,
    handleDeleteMeeting,
    handleUpdateFamily
};