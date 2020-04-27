import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Moment  from 'react-moment';

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
    }));
  
function Meeting({ ...props}) {
    
    const classes = useStyles();

    const [ inf, setInf ] = useState(props.detail);
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
      };

    return (
        <div className={classes.detail}>
        <div className={classes.line}>
        <Typography variant="h6"  color='textSecondary' className={classes.information}>
            Owner 
            </Typography>
            <Typography variant="h6" className={classes.information} >
                {inf.userId.name}
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
            Recurrence 
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
            {inf.meetingStatusId}
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
                <div>{attendant.userId} : {attendant.attendantStatusId} </div>
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

export default Meeting;