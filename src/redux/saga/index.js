import { takeEvery, all } from 'redux-saga/effects';
import { LOGIN_USER } from './loginActions';
import { LISTEN_MEETING_STATUS, LISTEN_MEETING_SCHEDULE, LISTEN_ATTENDANT_STATUS, LISTEN_GET_USERS } from './refDataActions';
import { MEETING_FAILURE, LISTEN_GET_MEETING, LISTEN_ADD_MEETING,
   LISTEN_GET_FILTERED_MEETINGS, LISTEN_UPDATE_MEETING, LISTEN_CLEAR, LISTEN_DELETE_MEETING, LISTEN_UPDATE_FAMILY } from './meetingActions';

import { handleLoginUser } from "./loginSaga";
import { handleMeetingStatusGet, handleAttendantStatusGet, handleMeetingScheduleGet, handleUsersGet  } from './refDataSaga';
import { handleMeetingGet, handleMeetingAdd, handleFilteredMeetings,
   handleUpdateMeeting, handleClearResponse,handleDeleteMeeting, handleUpdateFamily } from './meetingSaga';

function* watchAll() {
  yield all([
    takeEvery(LOGIN_USER, handleLoginUser),
    takeEvery(LISTEN_MEETING_STATUS, handleMeetingStatusGet),
    takeEvery(LISTEN_MEETING_SCHEDULE, handleMeetingScheduleGet),
    takeEvery(LISTEN_ATTENDANT_STATUS, handleAttendantStatusGet),
    takeEvery(LISTEN_GET_MEETING, handleMeetingGet),
    takeEvery(LISTEN_ADD_MEETING, handleMeetingAdd),
    takeEvery(LISTEN_GET_FILTERED_MEETINGS, handleFilteredMeetings),
    takeEvery(LISTEN_GET_USERS, handleUsersGet),
    takeEvery(LISTEN_UPDATE_MEETING, handleUpdateMeeting),
    takeEvery(LISTEN_CLEAR, handleClearResponse),
    takeEvery(LISTEN_DELETE_MEETING,handleDeleteMeeting),
    takeEvery(LISTEN_UPDATE_FAMILY,handleUpdateFamily)
  ])
}

export default watchAll;