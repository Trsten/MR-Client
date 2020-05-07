import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import TransferList from './TransferList';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux"
import TextField from '@material-ui/core/TextField';
import { listenAddMeeting } from '../redux/saga/meetingActions'
import { getLoggedUser } from '../redux/saga/loginActions'
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { KeyboardDatePicker,MuiPickersUtilsProvider,KeyboardTimePicker} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { listenClear } from '../redux/saga/meetingActions';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Toolbar from '@material-ui/core/Toolbar';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import AccessAlarmsRoundedIcon from '@material-ui/icons/AccessAlarmsRounded';

import Typography from '@material-ui/core/Typography';

import {createMeetingAPI, getMeetingStatusAPI, loginUser} from '../api';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '50%'
  },
  form: {
    width: '70%',
    marginLeft: '30%',
  },
  paper: {
    width: '100%',
  },
  DatePicker: {
    marginTop: '25px'
  },
  Checkboxes: {
    marginTop: '25px',
    marginLeft: 'auto'
  },
  submit: {
    marginTop: '25px',
    marginRight: 'auto',
    marginBottom: '25px'
  },
  alter: {
    position: 'fixed',
    bottom: '10px'
  },
  TransferList: {
    marginTop: '25px',
  }
}));

let refreshed = false;

function CreateForm({listenAddMeeting,createMeetingAPI,listenClear,...props}) {

  const getClearData = () => {
    return {
      userId: props.loggedUser.id,
      meetingStatusId: 40, 
      meetingScheduleId: 50,
      attendants: [],
      date: startDate,
      shortTitle: '',
      endDate: endDate,
      place: '',
      description: '',
      topic: ''
    }
  }

  const [mark, setMark] = useState("only once");
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState(getClearData());
  const [ refresh, setRefresh ] = useState(false);

  useEffect(() => {
      setEndDate(new Date());
      setStartDate(new Date());
      setMark("only once");
      setData(getClearData());
      changeRefresh();
    },[props.value]);


  const handleChangeBox = event => {
    setMark( event.target.name );
    setData({
      ...data,
      meetingScheduleId: Number(event.target.value) 
    });
  };

  const classes = useStyles();

  const onSubmitCreate = async () => {
    listenAddMeeting(data);
    handleOpenAlter();
    refreshed = true;
  }

  const changeRefresh = () => {
    setRefresh(refresh ? false : true);
  }

  const handleChangeData = event => {
      setData({
        ...data,
        [event.target.name]: event.target.value
      });
  };

  const showEndDate = () => {
    if (mark !== "only once") {
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <Grid container className={classes.DatePicker}>
              <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    margin="normal"
                    id="startDate"
                    label="End date"
                    required
                    value={endDate}
                    minDate={startDate}
                    onChange={handleEndDateChange}
                    helperText="Date to end recurring meetings"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
              </Grid>
            </MuiPickersUtilsProvider>
      )
    } 
  }


  const handleStartDateChange = date => {
    setStartDate(date);
    if (date.getDate() >= endDate.getDate()) {
      setEndDate(date);
    }
    setData({
      ...data,
      date: date
    });
  };

  const handleEndDateChange = date => {
    let zeroDate = new Date(date);
    zeroDate.setHours(0,0,0,0);
    setEndDate(zeroDate);
    setData({
      ...data,
      endDate: zeroDate
    });
  };

const checkedMark = (name) => {
  return name === mark ? true : false;
  }

  const [openAlter, setOpenAlter] = React.useState(false);

  const handleOpenAlter = () => {
    setOpenAlter(true);
  };

  const setAlter = () => {
    if(props.failMessage) {
      return {state: "error", msg: props.failMessage.substring(6, props.failMessage.length)};
    } else {
      return {state: "success", msg: " meeting was successfully created !"}
    }
  }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlter(false);
    };

    const showAlter = () => {
      if(!props.loading) {
        setAlter();
        return (
          <Snackbar open={openAlter} autoHideDuration={5000} onClose={handleClose} className={classes.alter}>
          <Alert onClose={handleClose} severity={setAlter().state} variant="filled">
          {setAlter().msg}
          </Alert>
        </Snackbar>
        );
      }
    };

    const handleInvitations = (usersToInvite) => {
      let att = [];
      usersToInvite.map(( user ) => (
        att = [...att,{userId: user.id, attendantStatusId: 30}]
      ));
      setData({
        ...data,
        attendants: att
      });
    };

    if ( props.succesMessage === 'succes') {
      if ( refreshed ) {
        props.refresh();
        listenClear();
        refreshed = false;
      }
    }

    return(
          <Paper className={classes.paper}>
          <Toolbar>
          <Typography variant="h5" noWrap >
            New Meeting
          </Typography>
          </Toolbar>

        <form className={classes.form} >
            <div>
            <TextField
            label="Short Title"
            id="margin-none"
            helperText="Title of meeting"
            name="shortTitle"
            required
            value={data.shortTitle}
            onChange={handleChangeData}
            margin="normal"
            className={classes.textField}
            inputProps={{maxLength: 30 }}
          />
            </div>
            <div>
            
            <TextField
              label="Place"
              id="margin-none"
              onChange={handleChangeData}
              className={classes.textField}
              helperText="Place of the meeting"
              required
              value={data.place}
              name="place"
              margin="normal"
              inputProps={{maxLength: 20 }}
            />
            </div>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <Grid container className={classes.DatePicker}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    margin="normal"
                    id="startDate"
                    label="Date"
                    required
                    minDate={new Date()}
                    helperText="Date of meeting"
                    value={startDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
                <Grid container className={classes.DatePicker}>
                <KeyboardTimePicker
                  required
                  margin='normal'
                  id="time-picker"
                  label="Time"
                  ampm={false}
                  helperText="Time of meeting"
                  keyboardIcon={<AccessAlarmsRoundedIcon />}
                  value={startDate.getTime()}
                  onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
                </Grid>
              </MuiPickersUtilsProvider>
              <div>
              <FormControl component="fieldset" className={classes.Checkboxes}>
                <FormLabel component="legend">Recurrence this meeting </FormLabel>
                  <FormGroup className={classes.Checkboxes}>
                    {props.meetingSchedule.map(( schedule ) => (
                      <FormControlLabel
                      key={schedule.recurrenceType}
                      label={schedule.recurrenceType} 
                      value={schedule.id}
                      control={<Checkbox 
                      checked={checkedMark(schedule.recurrenceType)} 
                      onChange={handleChangeBox} 
                      name={schedule.recurrenceType} />}
                      
                    />
                    ))}
                  </FormGroup>
              </FormControl>
              </div>
              <div>
                {showEndDate()}
              </div>
              <div>
              <TextField
                id="description"
                label="Description"
                placeholder="Placeholder"
                multiline
                value={data.description}
                name="description"
                className={classes.textField}
                helperText="Import description"
                onChange={handleChangeData}
              />
              </div>
                <div>
                <TextField
                id="topic"
                label="Topic"
                placeholder="Placeholder"
                multiline
                name="topic"
                value={data.topic}
                className={classes.textField}
                helperText="Import topic"
                onChange={handleChangeData}
              />
              </div>
            <div className={classes.TransferList}>
              <TransferList refresh={refresh} inicialize={handleInvitations} leftList={props.users} rightList={[]} owner={props.loggedUser.id }/>
            </div>
          <Button
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmitCreate}
                style={{ width: 350, marginLeft: 30, maxHeight: '48px', minHeight: '48px' }}
              >
                Create Meeting
          </Button>    
        </form>
        {showAlter()}
      </Paper>
    );
}

const mapStateToProps = state => ({
    loggedUser: state.userState.user,
    failMessage: state.meetingState.failMessage,
    succesMessage: state.meetingState.success,
    attendantStatus: state.refData.attendantStatus,
    meetingSchedule: state.refData.meetingSchedule,
    meetingState: state.refData.meetingState,
    users: state.refData.users,
    loading: state.meetingState.loading,
    meeting: state.meetingState.meeting,
});
const mapDispatchToProps = {
  getLoggedUser,
  listenAddMeeting,
  createMeetingAPI,
  listenClear
}
export default connect(
mapStateToProps,
mapDispatchToProps
)(CreateForm);