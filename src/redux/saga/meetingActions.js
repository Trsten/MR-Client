const LISTEN_ADD_MEETING = 'LISTEN_ADD_MEETING';
const ADD_MEETING = 'ADD_MEETING';

const LISTEN_GET_MEETINGS = 'LISTEN_GET_MEETINGS';
const GET_MEETINGS = 'GET_MEETINGS';

const LISTEN_GET_FILTERED_MEETINGS = 'LISTEN_GET_FILTERED_MEETINGS';
const GET_FILTERED_MEETINGS = 'GET_FILTERED_MEETINGS';

const LISTEN_GET_MEETING = 'LISTEN_GET_MEETING';
const GET_MEETING = 'GET_MEETING';

const LISTEN_DELETE_MEETING = 'LISTEN_DELETE_MEETING';
const DELETE_MEETING = 'DELETE_MEETING';

const LISTEN_UPDATE_MEETING = 'LISTEN_UPDATE_MEETING';
const UPDATE_MEETING = 'UPDATE_MEETING';

const LISTEN_UPDATE_FAMILY = 'LISTEN_UPDATE_FAMILY';
const UPDATE_FAMILY = 'UPDATE_FAMILY';

const MEETING_LOADING = 'MEETING_LOADING';

const LISTEN_CLEAR = 'LISTEN_CLEAR';
const MEETING_SUCCESS = 'MEETING_SUCCESS';
const MEETING_FAILURE = 'MEETING_FAILURE';

const CLEAR_MEETINGS = 'CLEAR_MEETINGS';
const LISTEN_CREAR_MEETING = 'LISTEN_CREAR_MEETING';

const listenUpdateFamily = (meeting) => ({
  type:LISTEN_UPDATE_FAMILY,
  meeting
})

const updateFamily = (index) => ({
  type: UPDATE_FAMILY,
  index
})

const listenDeleteMeeting = (index) => ({
  type: LISTEN_DELETE_MEETING,
  index
});

const deleteMeeting = (index) => ({
  type: DELETE_MEETING,
  index
});

const updateMeeting = (meeting) => ({
  type: UPDATE_MEETING,
  meeting
});

const listenClear = () => ({
  type: LISTEN_CLEAR,
  response: null
});

const meetingSuccess = (success) => ({
  type: MEETING_SUCCESS,
  success
});

const listenUpdateMeeting = (updatedMeeting) => ({
  type: LISTEN_UPDATE_MEETING,
  updatedMeeting,
});

const listenAddMeeting = (meeting) => ({
  type: LISTEN_ADD_MEETING,
  meeting
});

const listenGetMeetings = (meetings) => ({
  type: LISTEN_GET_MEETINGS,
  meetings
});

const listenGetFilteredMeetings = (filter) => ({
  type: LISTEN_GET_FILTERED_MEETINGS,
  filter
})

const listenGetMeeting = (index) => ({
  type: LISTEN_GET_MEETING,
  index
})

const addMeeting = (meeting) => ({
  type: ADD_MEETING,
  meeting
});

const getMeetings = (meetings) => ({
  type: GET_MEETINGS,
  meetings
});

const getFilteredMeetings = (meetings) => ({
  type: GET_FILTERED_MEETINGS,
  meetings
})

const getMeeting = (meeting) => ({
  type: GET_MEETING,
  meeting
});

const meetingLoading = (isLoading) => ({
  type: MEETING_LOADING,
  isLoading
})

const meetingFailure = error => ({
  type: MEETING_FAILURE,
  error
});

const clearMeetings = () => ({
type: CLEAR_MEETINGS,
meeting: []
});

export {
  meetingFailure,
  addMeeting,
  getMeetings,
  getMeeting,
  deleteMeeting,
  listenGetMeetings,
  listenAddMeeting,
  listenGetFilteredMeetings,
  listenGetMeeting,
  getFilteredMeetings,
  meetingLoading,
  listenUpdateMeeting,
  meetingSuccess,
  listenClear,
  updateMeeting,
  listenDeleteMeeting,
  listenUpdateFamily,
  updateFamily,
  clearMeetings,
  CLEAR_MEETINGS,
  UPDATE_FAMILY,
  LISTEN_UPDATE_FAMILY,
  LISTEN_DELETE_MEETING,
  UPDATE_MEETING,
  LISTEN_CLEAR,
  MEETING_LOADING,
  MEETING_FAILURE,
  ADD_MEETING,
  GET_MEETINGS,
  GET_MEETING,
  DELETE_MEETING,
  GET_FILTERED_MEETINGS,
  LISTEN_GET_MEETINGS,
  LISTEN_ADD_MEETING,
  LISTEN_GET_FILTERED_MEETINGS,
  LISTEN_GET_MEETING,
  LISTEN_UPDATE_MEETING,
  MEETING_SUCCESS
};