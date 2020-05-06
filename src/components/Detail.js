import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux"
import { getLoggedUser } from '../redux/saga/loginActions'
import { listenUpdateMeeting, listenClear, listenDeleteMeeting } from '../redux/saga/meetingActions';

import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { Redirect} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { red } from '@material-ui/core/colors';
import Meeting from './Meeting';
import EditMeeting from './EditMeeting';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import axios from "axios"

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
  buttonDelete : {
    marginTop: '25px',
    marginRight: 'auto',
    marginBottom: '25px',
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
  textField: {
    width: '40%',
  },
  }));

  let openOnce = true;

  function Detail({ listenUpdateMeeting,loggedUser,attendantStatus, listenClear, listenDeleteMeeting, ...props}) {

    const convertDate = (date) => {
      var dateStr = date.substring(0, date.length - 5);                 
      return(new Date(dateStr)) ;
    }

    const [ showDeleteDialog, setShowDeleteDialog ] = useState({open: false, possibleMultipleDelet: false});
    const [ checkedBox, setcheckedBox ] = useState("one");
    const [openAlter, setOpenAlter] = useState({open: false, severity: '', msg: ''});
    const [ edit, setEdit ] = useState(false);
    const [ actualData, setActualData ] = useState({
      ...props.detail,
      date: convertDate(props.detail.date),
      endDate: props.detail && props.detail.endDate ? convertDate(props.detail.endDate) : undefined});
      const [ infoFiles, setInfoFiles ] = useState();
      const [ editFiels, setEditFiles ] = useState(false);

      useEffect(() => {
        const file = {
            entityId: props.detail.id,
            entityDate: new Date().toISOString().substr(0,10),
            directory: "",
            fileDataList: [] 
          }
        getFilesInfo(file);
    },[]);

    const getFilesInfo = (formData) => {
      axios.post('http://localhost:9080/mrreport/file/info', formData)
      .then(result => {
         setInfoFiles(result.data.fileDataList);
      }) 
      .catch(error => console.log(error))
  }

    const handleCloseDeleteDialog = () => {
      setShowDeleteDialog({open: false});
    }

    const handleApplyDeleteDialog = () => {
      console.log(infoFiles);
      if ( !showDeleteDialog.possibleMultipleDelet ) {
        listenDeleteMeeting({ id: props.detail.id, delChildrens: false} );
      } else {
        listenDeleteMeeting({ id: props.detail.id, delChildrens: checkedBox === "one" ? false : true, files: infoFiles} );
      }      
      handleCloseDeleteDialog()
    }

    if ( props.success === "delete"  && !props.loading ) {
      props.closeDetail();
      props.refreshTable();
    }

    const handlecheckedBox = ( event ) => {
      setcheckedBox(event.target.name);
    }

    const isChecked = (name) => {
      return checkedBox == name ? true : false;
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlter({...openAlter,open: false});
    };

    const classes = useStyles();

    const handleChangeDelete = () => {
      let schedule = actualData.meetingScheduleId ? actualData.meetingScheduleId :  props.detail.meetingScheduleId;
      if (  schedule !== 50 ) {
        setShowDeleteDialog({open:true, possibleMultipleDelet: true});
      } else {
        setShowDeleteDialog({open: true, possibleMultipleDelet: false})
      }
    }

    const findAttendantStateId = (index) => {
      if (attendantStatus) {
        return attendantStatus.find( ({ id }) => id === index ).status;
      }
    }

    const findMeeingScheduleId = (index) => {
      if (props.meetingSchedule != undefined) {
        return props.meetingSchedule.find( ({ id }) => id === index ).recurrenceType;
      }
    }

    const findMeetingStateId = (index) => {
      if ( props.meetingState != undefined) {
        return props.meetingState.find( ({ id }) => id === index ).status;
      }
    }

    const findUser = (index) => {
      if (props.users != undefined) {
          return props.users.find( ({ id }) => id === index );
        }
    }

    const handleOpenEdit = () => {
      setEdit(true);
    }

    const getInvitedName = (index) => {
      return props.users.find( ({ id }) => id === index ).name;
    };

    //posielam data ktore sa zmenia v EditMeeting ulozim do aktualData a poslem do Meeting
    const onChangeActualData = (updated, alter) => {
      setActualData({
          ...actualData,
           ...updated,
        });
        setOpenAlter(alter);
        if ( alter.severity === "success" || alter.severity === "none") {
          setEdit(false);
        }
        props.refreshTable();
    };

    const sendInfToMeeting = () => {
      console.log(actualData);

      let local = Object.assign({}, actualData);
      let attendantsLocal = [];

      local.attendants.map(( att ) => {
        let obj = {userName: getInvitedName(att.userId),
          userId: att.userId,
          attendentStatus: findAttendantStateId(att.attendantStatusId),
          attendantStatusId: att.attendantStatusId,
          id: att.id };
          attendantsLocal = [...attendantsLocal,obj];
      });
      local = {...local, 
        userId: findUser(actualData.userId),
        meetingStatusId: findMeetingStateId(actualData.meetingStatusId),
        meetingScheduleId: findMeeingScheduleId(actualData.meetingScheduleId),
        attendants: attendantsLocal };
      return local;
    };

    const handleOpenEditFiles = () => {
      setEditFiles( editFiels ? false : true);
    }

  const updateFiles = (files) => {
    setInfoFiles(files);
  }

  const callRefresTable = () => {
    props.refreshTable();
  }

  return(
      <div>
        <Dialog open={showDeleteDialog.open} onClose={handleCloseDeleteDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete meeting !</DialogTitle>
        <DialogContent>
          <DialogContentText>
          { showDeleteDialog.possibleMultipleDelet ? " This meeting is repetitive would you like to remove " : 
            " Are you sure you want to delete this meeting ?" } 
          </DialogContentText>
          { showDeleteDialog.possibleMultipleDelet ? <FormGroup>
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
            </FormGroup> : "" }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApplyDeleteDialog} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

        <Toolbar>
          <Typography variant="h5" noWrap >
            {actualData ? actualData.shortTitle : props.detail.shortTitle }
          </Typography>
          <Tooltip title="Close">
            <IconButton 
              onClick={props.closeDetail}
              className={classes.toolbarButtons} 
                >
                  <CloseIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      <div className={classes.detail}>
        { edit ? <EditMeeting 
          update={onChangeActualData} 
          data={Object.assign({}, actualData)} 
          closeAll={props.closeDetail} ></EditMeeting> 
          : <Meeting 
              detail={sendInfToMeeting()} 
              infoFiles={infoFiles}
              updateFiles={updateFiles} 
              editMode={editFiels} 
              user={loggedUser}
              attendantStatus={attendantStatus}
              refreshTable={callRefresTable}
              ></Meeting>}
       
        {  (loggedUser.id === actualData.userId && !edit) ?
            <div>
              <Button
            variant="contained"
            color="primary"
            className={classes.buttonDelete}
            onClick={handleChangeDelete}
            style={{ width: 150, marginLeft: '25%', maxHeight: '48px', minHeight: '48px' }}
          > Delete </Button>  
          { actualData.meetingStatusId === 43 || actualData.meetingStatusId === 41 ? "" :
          <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleOpenEditFiles}
              style={{ width: 150, marginLeft: '20pt', maxHeight: '48px', minHeight: '48px' }}
          > { editFiels ? 'Leave Files' : 'Edit Files' } </Button> }
           {actualData.meetingStatusId === 43 || actualData.meetingStatusId === 41 ? "" :
          <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleOpenEdit}
              style={{ width: 150, marginLeft: '20pt', maxHeight: '48px', minHeight: '48px' }}
          > Edit </Button> }
            
            </div>
            : '' }
      </div>
      <Snackbar open={openAlter.open} autoHideDuration={5000} onClose={handleClose} className={classes.alter}>
          <Alert onClose={handleClose} severity={openAlter.severity} variant="filled">
            {openAlter.msg}
          </Alert>
        </Snackbar>
    </div>
    );
}

const mapStateToProps = state => ({
    meeting: state.meetingState.meeting,
    loggedUser: state.userState.user,
    users: state.refData.users,
    failMessage: state.userState.failMessage,
    attendantStatus: state.refData.attendantStatus,
    users: state.refData.users,
    meetingSchedule: state.refData.meetingSchedule,
    meetingState: state.refData.meetingState,
    loading: state.meetingState.loading,
    success: state.meetingState.success,
});
const mapDispatchToProps = {
    getLoggedUser,
    listenUpdateMeeting,
    listenClear,
    listenDeleteMeeting
}
export default connect(
mapStateToProps,
mapDispatchToProps
)(Detail);