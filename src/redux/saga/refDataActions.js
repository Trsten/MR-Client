const GET_MEETING_STATUS = 'GET_MEETING_STATUS';
const LISTEN_MEETING_STATUS = 'LISTEN_MEETING_STATUS';
const FAILURE = 'FAILURE';

const GET_MEETING_SCHEDULE = 'GET_MEETING_SCHEDULE';
const LISTEN_MEETING_SCHEDULE = 'LISTEN_MEETING_SCHEDULE';

const GET_ATTENDANT_STATUS = 'GET_ATTENDANT_STATUS';
const LISTEN_ATTENDANT_STATUS = 'LISTEN_ATTENDANT_STATUS';

const GET_USERS = 'GET_USERS';
const LISTEN_GET_USERS = 'LISTEN_GET_USERS';

const getUsers = (users) => ({
    type: GET_USERS,
    users
});

const listenGetUsers = (users) => ({
    type: LISTEN_GET_USERS,
    users
});

const listenMeetingStatus = (meetingStatus) => ({
    type: LISTEN_MEETING_STATUS,
    meetingStatus
});

const getMeetingStatus = (meetingStatus) => ({
    type: GET_MEETING_STATUS,
    meetingStatus
});

const listenMeetingSchedule = (meetingSchedule) => ({
    type: LISTEN_MEETING_SCHEDULE,
    meetingSchedule
});

const getMeetingSchedule = (meetingSchedule) => ({
    type: GET_MEETING_SCHEDULE,
    meetingSchedule
});

const listenAttendantStatus = (attendantStatus) => ({
    type: LISTEN_ATTENDANT_STATUS,
    attendantStatus
});

const getAttendantStatus = (attendantStatus) => ({
    type: GET_ATTENDANT_STATUS,
    attendantStatus
});

const refDataFailure = (error) => ({
    type: FAILURE,
    error
});

export {
    getMeetingStatus,
    listenMeetingStatus,
    listenMeetingSchedule,
    getMeetingSchedule,
    listenAttendantStatus,
    getAttendantStatus,
    listenGetUsers,
    getUsers,
    refDataFailure,
    GET_MEETING_STATUS, LISTEN_MEETING_STATUS, 
    GET_MEETING_SCHEDULE, LISTEN_MEETING_SCHEDULE,
    GET_ATTENDANT_STATUS, LISTEN_ATTENDANT_STATUS,
    GET_USERS,LISTEN_GET_USERS,
    FAILURE, 
};