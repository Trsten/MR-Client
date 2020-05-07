import axios from "axios"

const USER_URL = 'http://localhost:9080/mrreport/user/';
const MEETING_URL = 'http://localhost:9080/mrreport/meeting/';
const REF_DATA_URL = 'http://localhost:9080/mrreport/refdata/';

const loginUser = (user) => 
  axios.post(USER_URL + 'login', user.user)
    .then(result => ({ result }))
    .catch(error => ({ error }))
  
const getAllMeetingsAPI = () =>
  axios.get(MEETING_URL + 'all')
      .then(result => ({ result }))
      .catch(error => ({ error }))

const getFilteredMeetingsAPI = (filter) =>
axios.post(MEETING_URL + 'filter', filter.filter)
    .then(result => ({ result }))
    .catch(error => ({ error }))

const createMeetingAPI = (meeting) =>
  axios.post( MEETING_URL + 'create', meeting.meeting)
  .then(result => ({result}))
  .catch(error => ({error}))

  const getMeetingAPI = (index) =>
  axios.get(MEETING_URL + index.index)
      .then(result => ({ result }))
      .catch(error => ({ error }))

  const getMeetingStatusAPI = () =>
  axios.get(REF_DATA_URL + 'meetingStatus/all')
    .then(result => ({ result }))
    .catch(error => ({ error }))

const getMeetingScheduleAPI = () =>
  axios.get(REF_DATA_URL + 'meetingSchedule/all')
    .then(result => ({ result }))
    .catch(error => ({ error }))

const getAttendantStatusAPI = () =>
  axios.get(REF_DATA_URL + 'attendantStatus/all')
    .then(result => ({ result }))
    .catch(error => ({ error }))
    
const getUsersAPI = () =>
  axios.get(USER_URL + 'all')
    .then(result => ({ result }))
    .catch(error => ({ error }))

const updateMeetingAPI = (updatedMeeting) =>
  axios.put(MEETING_URL + 'update', updatedMeeting.updatedMeeting)
  .then(result => ({result }))
  .catch(error => ({ error }))

const updateFamilyMeetingsAPI = (meeting) =>
  axios.put(MEETING_URL + 'updateFamily', meeting.meeting)
  .then(result => ({ result }))
  .catch(error => ({ error }))

const deleteMeetingAPI = (index) =>
axios.delete(MEETING_URL + 'delete/' + index.index.id + '/' + index.index.delChildrens)
.then(result => ({ result }))
.catch(error => ({ error }))

export {
  loginUser,
  getMeetingStatusAPI,
  getMeetingAPI,
  createMeetingAPI,
  getMeetingScheduleAPI,
  getAttendantStatusAPI,
  getFilteredMeetingsAPI,
  updateMeetingAPI,
  deleteMeetingAPI,
  getUsersAPI,
  updateFamilyMeetingsAPI
};  