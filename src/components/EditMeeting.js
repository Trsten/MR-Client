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
  submit: {
    marginTop: '25px',
    marginRight: 'auto',
    marginBottom: '25px'
  },
  textField: {
    width: '40%',
  },
  }));

  function EditMeeting({ listenUpdateMeeting,listenUpdateFamily, listenClear,listenDeleteMeeting,listenAddMeeting,  ...props}) {

    const classes = useStyles();    

    const [ updates, setUpdates ] = useState();
    const [ updateDate, setUpdateDate ] = useState(props.data.date);
    const [ updateEndDate, setUpdateEndDate ] = useState(props.data.endDate)
    const [ updateOnetoEvery, setUpdateOnetoEvery ] = useState(false);
    const [ showUpdateDialog, setShowUpdateDialog ] = useState(false);
    const [ checkedBox, setcheckedBox ] = useState("one");

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
      //TODO: ak je cas konania po aktualnom datume a case nie je mozne zmenit status meetingu na planovany
        var statuses = [];
        for(var i = 0 ; i < props.meetingState.length ; i++) {
            statuses.push({
            value: props.meetingState[i].id,
            label: props.meetingState[i].status
            })
        }
        return statuses;
    }

    const handleChangeSave = () => {
      //TODO: treba dorobit update of all childrens 
        if (updates) {
            if ( updateOnetoEvery) {
              listenDeleteMeeting({ id: props.data.id, delChildrens: false } );
              let att = updates.attendants ? updates.attendants : props.data.attendants;
              let prepareAtt = att.map(( attendant ) => {
                return {userId: attendant.userId, attendantStatusId: 30 }
              }) 
              delete props.data.id; 
              listenAddMeeting({
                ...props.data,
                ... updates,
                attendants: prepareAtt});
            } else {
              if ( (!updates.meetingScheduleId && props.data.meetingScheduleId === 50) || updates.meetingScheduleId === 50 ) {
                listenUpdateMeeting({
                  ...updates,
                  id: props.data.id,
                  attendants: updates.attendants === undefined ? props.data.attendants : updates.attendants });
              } else {
                if ( !updates.meetingScheduleId  || props.data.meetingScheduleId === updates.meetingScheduleId ) {
                  setShowUpdateDialog(true);
                } else {
                  listenDeleteMeeting({ id: props.data.id, delChildrens: true } );
                  let att = updates.attendants ? updates.attendants : props.data.attendants;
                  let prepareAtt = att.map(( attendant ) => {
                    return {userId: attendant.userId, attendantStatusId: 30 }
                  }) 
                  delete props.data.id; 
                  listenAddMeeting({
                    ...props.data,
                    ... updates,
                    attendants: prepareAtt});
                }
              }
            }
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
      };

      const handleOnChangeNewDate = newDate => {
        //TODO: ak je datum meetingu po aktualnom čase nie je možnosť zmeniť čas
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
        usersToInvite.map(( user ) => (
          att = [...att,{userId: user.id, attendantStatusId: 30 }]
        ));
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

      if( props.success === "update") {
        props.update({
            ...updates,
        },{open: true, severity: "success", msg: "Meetgin was succesfully updated !"});
        listenClear();
      }

    return(
        <div className={classes.detail}>
           <Dialog open={showUpdateDialog} onClose={handleCloseUpdateDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update meeting </DialogTitle>
        <DialogContent>
          <DialogContentText>
          This meeting is repetitive would you like to update
          </DialogContentText>
          <FormGroup>
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
            </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApplyUpdateDialog} color="primary">
            Update
          </Button>
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
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Time 
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardTimePicker
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
        </div>
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
            /> 
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Recurrence 
            </Typography>
            <TextField
                id="select-meeting-Status"
                select
                name="meetingScheduleId"
                defaultValue={props.data.meetingScheduleId}
                onChange={handleOnChangeUpdate}
            >
                 {getMeetingSchedule().map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
                ))}
            </TextField>
        </div>
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
        > Cancel </Button> 
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