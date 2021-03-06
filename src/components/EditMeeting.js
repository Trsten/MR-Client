import React, { useState , useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux"
import { listenUpdateMeeting, listenClear,listenDeleteMeeting, listenAddMeeting, listenUpdateFamily } from '../redux/saga/meetingActions';

import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker,MuiPickersUtilsProvider,KeyboardTimePicker} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import AccessAlarmsRoundedIcon from '@material-ui/icons/AccessAlarmsRounded';
import TransferList from './TransferList';
import MenuItem from '@material-ui/core/MenuItem';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import CircularProgress from '@material-ui/core/CircularProgress';

import Moment  from 'react-moment';

const useStyles = makeStyles(theme => ({
  toolbarButtons: {
    marginLeft: 'auto',
    textAlign: "end"
  },
  title: {
    textAlign: "left",
    width: '40pt'
  },
  information: {
    display: 'inline-block',
    margin: 'auto',
    width: '20%',
    verticalAlign: 'text-top',
    textAlign: 'justify',
    textJustify: 'inter-word',
    minWidth: '100pt'
  },
  value: {
    display: 'inline-block',
    margin: 'auto',
    width: '70%',
    minWidth: '100pt',
    verticalAlign: 'text-top',
    textJustify: 'inter-word',
    boxSizing: 'border-box',
  },
  line: {
    marginBottom: '10pt',
  },
  detail: {
    width: '80%',
    margin: 'auto',
  },
  proccess: {
    marginTop: '25px',
    marginBottom: '25px'
  },
  submit: {
    marginTop: '25px',
    marginRight: 'auto',
    marginBottom: '25px'
  },
  textField: {
    width: '40%',
  },
  }));

  const ONLY_ONCE = 50;
  const INVITED = 30;
  const PLANNING = 40;
  const CANCELED = 41;
  const TERMINATE = 42;
  const CLOSED = 43;

  let waitForMail = false;

  function EditMeeting({ listenUpdateMeeting,listenUpdateFamily, listenClear,listenDeleteMeeting,listenAddMeeting,  ...props}) {

    const classes = useStyles();    

    const [ updates, setUpdates ] = useState();
    const [ updateDate, setUpdateDate ] = useState(props.data.date);
    const [ updateEndDate, setUpdateEndDate ] = useState(props.data.endDate)
    const [ updateOnetoEvery, setUpdateOnetoEvery ] = useState(false);
    const [ showUpdateDialog, setShowUpdateDialog ] = useState(false);
    const [ checkedBox, setcheckedBox ] = useState("one");
    const [ infDialog, setInfDialog ] = useState(false);

    const handleCloseUpdateDialog = () => {
      setShowUpdateDialog(false);
    }

    const handleApplyUpdateDialog = () => {
      let newData = {
        ...updates,
        id: props.data.id,
        attendants: updates.attendants === undefined ? props.data.attendants : updates.attendants };
      checkedBox === "one" ? listenUpdateMeeting(newData) : listenUpdateFamily(newData);
      setShowUpdateDialog(false);
    }

    const handlecheckedBox = ( event ) => {
      setcheckedBox(event.target.name);
    }

    const isChecked = (name) => {
      return checkedBox == name ? true : false;
    }

    const getMeetingSchedule = () => {
        var statuses = [];
        for(var i = 0 ; i < props.meetingSchedule.length ; i++) {
          statuses.push({
            value: props.meetingSchedule[i].id,
            label: props.meetingSchedule[i].recurrenceType
          })
        }
        return statuses;
    }
  
  const getMeetingStatuses = () => { 
      var statuses = [];
      for(var i = 0 ; i < props.meetingState.length ; i++) {
        if (props.data.meetingStatusId !== PLANNING && new Date() > props.data.date) {
          if ( props.meetingState[i].id === TERMINATE || props.meetingState[i].id === CLOSED ) {
            statuses.push({
              value: props.meetingState[i].id,
              label: props.meetingState[i].status
              });
            }
          } else {
            if ( props.data.meetingStatusId === TERMINATE || props.data.meetingStatusId === CLOSED ) {
                statuses.push({
                  value: props.meetingState[i].id,
                  label: props.meetingState[i].status
                  });
            } else {
              if (props.meetingState[i].id !== CLOSED) {
              statuses.push({
                value: props.meetingState[i].id,
                label: props.meetingState[i].status
                });
              }
            }
          }

        }
      return statuses;
    }

    const handleChangeSave = () => {
        if (updates) {
          if ( updateOnetoEvery) {
              waitForMail = true;
              //z only one to every week/month
              listenDeleteMeeting({ id: props.data.id, delChildrens: false } );
              let att = updates.attendants ? updates.attendants : props.data.attendants;
              let prepareAtt = att.map(( attendant ) => {
                return {userId: attendant.userId, attendantStatusId: INVITED }
              }) 
              delete props.data.id; 
              listenAddMeeting({
                ...props.data,
                ... updates,
                attendants: prepareAtt});
            } else {
              if ( (!updates.meetingScheduleId && props.data.meetingScheduleId === ONLY_ONCE) || updates.meetingScheduleId === ONLY_ONCE ) {
                listenUpdateMeeting({
                  ...updates,
                  id: props.data.id,
                  attendants: updates.attendants === undefined ? props.data.attendants : updates.attendants });
              } else {
                if ( !updates.meetingScheduleId  || props.data.meetingScheduleId === updates.meetingScheduleId ) {
                  setShowUpdateDialog(true);
                } else {
                  //every to every
                  waitForMail = true;
                    listenDeleteMeeting({ id: props.data.id, delChildrens: true } );
                  let att = updates.attendants ? updates.attendants : props.data.attendants;
                  let prepareAtt = att.map(( attendant ) => {
                    return {userId: attendant.userId, attendantStatusId: INVITED }
                  });
                  delete props.data.id; 
                  listenAddMeeting({
                    ...props.data,
                    ... updates,
                    attendants: prepareAtt});
                }
              }
            }
            props.refresh();
        } else {
          props.update(
            Object.assign({}, props.data),
             {open: true, severity: "warning", msg: "No changes detected !"});
        }
    };

    const handleChangeCancel = () => {
        props.update(props.data,{open: false, severity: "none"});
      };

    const handleOnChangeUpdate = event => {
      setUpdates({
          ...updates,
          [event.target.name]: event.target.value
      });
      if ( event.target.name ===  "meetingScheduleId") {
        if ( props.data.meetingScheduleId === 50 ) {
          setUpdateOnetoEvery( event.target.value !== 50 ? true : false );
        }
      }
      if ( event.target.name === "meetingStatusId" ) {
        //cant anymore do changes
        if ( (event.target.value ===  CANCELED || event.target.value === CLOSED) && new Date() > props.data.date) {
          setInfDialog(true);
          setShowUpdateDialog(true);
        }

      }
    };

    const handleOnChangeNewDate = newDate => {
        setUpdates({
            ...updates,
            date: newDate
        });
        setUpdateDate(newDate);
    };

    const handleOnChangenewEndDate = newDate => {
      setUpdates({
        ...updates,
        endDate: newDate
      });
      setUpdateEndDate(newDate);
    }

    const handleInvitations = (usersToInvite) => {
      let att = [];
      usersToInvite.map(( user ) => {
        let status = props.data.attendants.find(( {userId} ) => userId === user.id)
        att = [...att,{userId: user.id, attendantStatusId: status ? status.attendantStatusId : INVITED}];
      }
      );
      setUpdates({
        ...updates,
        attendants: att
      });
    };

    const getRightList = () => {
      let att = [];
      props.data.attendants.map(( attendant ) => {
        let index = attendant.userId;
        att = [...att,props.users.find( ({ id }) => id === index )];
      });
      return att;
    };

    const getLeftList = () => {
      let att = [];
      props.users.map(( user ) => {
        if (!props.data.attendants.some(e => e.userId === user.id)) { 
          att = [...att,user];
        } ;         
      });
      return att;
    };

    if( props.success === "succes" && props.loading === false) {
      waitForMail = false;
    }

    if( props.success === "update" && props.loading === false) {
      props.update({
          ...updates,
      },{open: true, severity: "success", msg: "Meetgin was succesfully updated !"});
    }

    return(
        <div className={classes.detail}>
           <Dialog open={showUpdateDialog} onClose={handleCloseUpdateDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{infDialog ? "Warning"  : "Update meeting" }</DialogTitle>
        <DialogContent>
          <DialogContentText>
            { infDialog ? "When set this state, you cant add files and edit meeting anymore." : "This meeting is repetitive would you like to update."}
          </DialogContentText>
          {infDialog ? "" : <FormGroup>
              <FormControl component="fieldset" className={classes.Checkboxes}>
                  <FormControlLabel
                    control={<Checkbox checked={isChecked("one")} onChange={handlecheckedBox} name="one" />}
                    label="only this meeting" value="one"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isChecked("every")} onChange={handlecheckedBox} name="every" />}
                    label="every meeting" value="every"
                  />
              </FormControl>
          </FormGroup>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            {infDialog ? "OK" : "Cancel"}
          </Button>
          {infDialog ? "" :
          <Button onClick={handleApplyUpdateDialog} color="primary">
            Update
          </Button> }
        </DialogActions>
      </Dialog>
        <div className={classes.line}>
        <Typography variant="h6"  color='textSecondary' className={classes.information}>
            Owner 
            </Typography>
            <Typography variant="h6" className={classes.information} >
                You
            </Typography>        
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Short title  
            </Typography>
                <TextField
                id="shortTitle"
                name="shortTitle"
                required
                defaultValue={props.data.shortTitle}
                onChange={handleOnChangeUpdate}
                inputProps={{maxLength: 30 }}
                className={classes.textField} />
        </div>   
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Topic  
            </Typography>
                <TextField
                id="topic"
                name="topic"
                required
                defaultValue={props.data.topic}
                onChange={handleOnChangeUpdate}
                className={classes.textField} /> 
        </div>  
        { props.data.meetingStatusId !== PLANNING && new Date() > props.data.date ? 
        <div className={classes.line}>
        <Typography variant="h6" className={classes.information} color='textSecondary'>
        Date  
        </Typography>
    <Typography variant="h6" className={classes.value}>
         <Moment format="DD.MM.YYYY">{props.data.date}</Moment> 
    </Typography>
          </div> :
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Date  
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd.MM.yyyy"
                id="date"
                minDate={new Date()}
                value={updateDate}
                name="date"
                onChange={handleOnChangeNewDate}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
        </div> }

           { props.data.meetingStatusId !== PLANNING && new Date() > props.data.date?
          <div className={classes.line}>
          <Typography variant="h6" className={classes.information} color='textSecondary'>
              Time 
              </Typography>
              <Typography variant="h6" className={classes.value}> 
              <Moment format="HH:mm">{props.data.date}</Moment>
              </Typography>
              </div> :
          <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Time 
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardTimePicker
                    ampm={false}
                    required
                    id="time-picker"
                    name="time"
                    keyboardIcon={<AccessAlarmsRoundedIcon />}
                    value={updateDate}
                    onChange={handleOnChangeNewDate}
                    KeyboardButtonProps={{
                    'aria-label': 'change time',
                    }}
                />
        </MuiPickersUtilsProvider>
        </div>} 
        {  props.data.meetingStatusId !== PLANNING && new Date() > props.data.date?  
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Place 
            </Typography>
            <Typography variant="h6" className={classes.value}>
            {props.data.place}
            </Typography> 
        </div> :
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Place 
            </Typography>
            <TextField
            id="place"
            name="place"
            defaultValue={props.data.place}
            onChange={handleOnChangeUpdate}
            className={classes.textField}
            inputProps={{maxLength: 20 }}
            /> 
        </div> }
        { props.data.meetingStatusId !== PLANNING ?
         <div className={classes.line}>
         <Typography variant="h6" className={classes.information} color='textSecondary'>
         Repeat 
         </Typography>
     <Typography variant="h6" className={classes.value}>
         { props.meetingSchedule.find(({ id }) => id === props.data.meetingScheduleId).recurrenceType}
         </Typography>
     </div> :
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Repeat 
            </Typography>
            <TextField
                id="select-meeting-Status"
                select
                name="meetingScheduleId"
                defaultValue={props.data.meetingScheduleId}
                onClick={ () => setInfDialog(false)}
                onChange={handleOnChangeUpdate}
                >
                 {getMeetingSchedule().map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
                ))}
            </TextField>
        </div> }
        {  updateOnetoEvery ?  
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            End date 
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd.MM.yyyy"
                id="endDate"
                minDate={updateDate}
                value={updateEndDate}
                name="endDate"
                onChange={handleOnChangenewEndDate}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
            /> 
        </MuiPickersUtilsProvider>
        </div> : "" }
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            State 
            </Typography>
                <TextField
                id="select-meeting-Status"
                select
                name="meetingStatusId"
                defaultValue={props.data.meetingStatusId}
                onChange={handleOnChangeUpdate}
            >
                {getMeetingStatuses().map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
                ))}
            </TextField>
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Description 
            </Typography>
            <TextField
                id="description"
                defaultValue={props.data.description}
                multiline
                name="description"
                className={classes.textField}
                onChange={handleOnChangeUpdate}
                /> 
            </div>
        <div className={classes.line}>
            <TransferList 
                inicialize={handleInvitations} 
                leftList={getLeftList()} 
                rightList={getRightList()} 
                owner={props.data.userId} />
        </div>
        { waitForMail || props.loading ?
            <div style={{ marginLeft: 200 }}>
               <CircularProgress 
            className={classes.proccess}
             />
            </div> :
            <div>
        <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleChangeSave}
            style={{ width: 150, marginLeft: '20pt', maxHeight: '48px', minHeight: '48px' }}
        > Save </Button> 
        <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleChangeCancel}
            style={{ width: 150, marginLeft: '20pt', maxHeight: '48px', minHeight: '48px' }}
        > Cancel </Button></div> }
  </div>
  );
}

const mapStateToProps = state => ({
  users: state.refData.users,
  failMessage: state.userState.failMessage,
  attendantStatus: state.refData.attendantStatus,
  users: state.refData.users,
  meetingSchedule: state.refData.meetingSchedule,
  meetingState: state.refData.meetingState,
  loading: state.meetingState.loading,
  success: state.meetingState.success
});
const mapDispatchToProps = {
  listenUpdateMeeting,
  listenClear,
  listenDeleteMeeting,
  listenAddMeeting,
  listenUpdateFamily
}
export default connect(
mapStateToProps,
mapDispatchToProps
)(EditMeeting);