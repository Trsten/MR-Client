import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Moment  from 'react-moment';

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@material-ui/core/IconButton";

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { connect } from "react-redux";
import { listenUpdateMeeting  } from '../redux/saga/meetingActions';

import Files from './Files';

const useStyles = makeStyles(theme => ({
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
    files: {
        display: 'inline-block',
        margin: 'auto',
        width: '70%',
        minWidth: '100pt',
        verticalAlign: 'text-top',
        textJustify: 'inter-word',
        boxSizing: 'border-box',
      },
    editIcon: {
        marginLeft: '30%',

    }
    }));
  
function Meeting({listenUpdateMeeting, ...props}) {
    
    const classes = useStyles();

    const getUserInvitation = () => {
        let user = props.detail.attendants.find(({ userName }) =>  userName === props.user.name );
        if (user) {
            console.log(user);
            return {id: user.attendantStatusId,status: user.attendentStatus};
        }
        return null;
    }

    const [ inf, setInf ] = useState(props.detail);
    const [ editInvitation, setEditInvitation  ] = useState(false);
    const [ selectedState, setSelectedState ] = useState(getUserInvitation());

    const openEditInvitation = () => {
        setEditInvitation(true);
    }

    const closeEditInvitation = () => {
        setEditInvitation(false);
    }

    const apllyEditInvitation = (attendant) => {
        attendant.attendantStatus = selectedState.status;
        attendant.attendantStatusId = selectedState.id;
        setEditInvitation(false);

        let attendants = [];
        inf.attendants.map(( att ) => {
            attendants = [...attendants,{
                id: att.id,
                attendantStatusId: att.attendantStatusId,
                userId: att.userId
            }]
        });
        listenUpdateMeeting({id: inf.id, attendants:attendants});
        props.refreshTable();
    }

    const handleOnChangeUpdate = event => {
        let status = props.attendantStatus.find(({ status }) => status === event.target.value);
        setSelectedState({id: status.id,status: status.status});
    }

    const showInvitation = attendant => {
        if ( attendant.userName === props.user.name ) {
            if ( editInvitation ) {
               return ( <div>
                    You :   <TextField
                    id="select-meeting-Status"
                    select
                    name="attendantStatus"
                    value={selectedState.status}
                    onChange={handleOnChangeUpdate}
                    >
                    { props.attendantStatus.map(status => {
                        if ( status.id !== 30 )
                        return (
                            <MenuItem key={status.id} value={status.status}>
                                {status.status}
                            </MenuItem>
                        )
                    })}
                    </TextField>
                    <IconButton className={classes.editIcon} onClick={event => apllyEditInvitation(attendant)}>
                        <CheckIcon />
                    </IconButton>
                    <IconButton onClick={event => closeEditInvitation()}>
                        <ClearIcon />
                    </IconButton>
                </div> );
            } else {
                return (
                    <div>
                        You : {selectedState.status}
                        {inf.meetingStatusId === 40 ?
                        <IconButton className={classes.editIcon} onClick={event => openEditInvitation()}>
                            <EditIcon />
                        </IconButton> : '' }
                    </div>);
            }
        } else {
            return <div> {attendant.userName} : {attendant.attendentStatus} </div> 
        }
    }

    return (
        <div className={classes.detail}>
        <div className={classes.line}>
            <Typography variant="h6"  color='textSecondary' className={classes.information}>
            Owner 
            </Typography>
            <Typography variant="h6" className={classes.value} >
                {inf.userId.name === props.user.name ? "You" : inf.userId.name}
            </Typography>        
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Topic  
            </Typography>
        <Typography variant="h6" className={classes.value}>
            {inf.topic} 
            </Typography>
        </div>    
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Date  
            </Typography>
        <Typography variant="h6" className={classes.value}>
            { inf.date !== undefined ? <Moment format="DD.MM.YYYY">{inf.date}</Moment> : "" }
        </Typography>
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Time 
            </Typography>
            <Typography variant="h6" className={classes.value}> 
            { inf.date !== undefined ? <Moment format="HH:mm">{inf.date}</Moment> : ""}
            </Typography>
            
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Place 
            </Typography>
            <Typography variant="h6" className={classes.value}>
            {inf.place}
            </Typography> 
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Repeat 
            </Typography>
        <Typography variant="h6" className={classes.value}>
            {inf.meetingScheduleId}
            </Typography>
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            State 
            </Typography>
        <Typography variant="h6" className={classes.value}>
            {inf.meetingStatusName}
            </Typography>
        </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Description 
            </Typography>
        <Typography variant="h6" paragraph className={classes.value}>
            {inf.description} 
            </Typography>
            </div>
        <div className={classes.line}>
            <Typography variant="h6" className={classes.information} color='textSecondary' >
            Invited
            </Typography>
            <Typography  variant="h6" className={classes.value}>
            {inf.attendants.map((attendant, i) => (
            <div key={`attendant-${i}`}>
                {showInvitation(attendant)}
            </div>
            ))}
            </Typography> 
        </div>
        <div >
            <Typography variant="h6" className={classes.information} color='textSecondary'>
            Files 
            </Typography>
            <Collapse in={props.infoFiles ? true : false} className={classes.files} >
                <Typography variant="h6">
                    <Files 
                        index={props.detail.id} 
                        infoFiles={props.infoFiles} 
                        editable={ props.editMode }
                        updateFiles={props.updateFiles}>
                    </Files>
                </Typography>
            </Collapse>
        </div>
    </div>
    );
}

const mapStateToProps = state => ({
  });

  const mapDispatchToProps = {
    listenUpdateMeeting,
  }
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Meeting);
