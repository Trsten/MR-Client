import React, { useState, useEffect } from "react";
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from "react-redux";
import { listenGetFilteredMeetings, listenClear } from '../redux/saga/meetingActions';
import { getLoggedUser } from '../redux/saga/loginActions';
import { makeStyles } from '@material-ui/core/styles';


import TableRowMenu from './TableRowMenu';

import Typography from '@material-ui/core/Typography';

import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from '@material-ui/icons/FilterList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Moment  from 'react-moment';
import Detail from "./Detail";

import { KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';

import CircularProgress from '@material-ui/core/CircularProgress';

var tableFilter = {
  userId: 0,
  startDate: '',
  endDate: '',
  attendant: false,
  owner: false,
}

function Table({listenClear, ...props}) {
  
  const useStyles = makeStyles(theme => ({
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  toolbarButtons: {
    textAlign: "end"
  },
  filterDate: {
    marginLeft: 'auto',
  },
  proccess: {
    marginTop: '25px',
    marginBottom: '25px'
  },
  }));

  const classes = useStyles();
    
    useEffect(() => {
      setShowItemDetail(false);

      var startDate = new Date(); 
      startDate.setHours(0,0,0,0);    
      var startDateJson = JSON.stringify(startDate);
      setSelectedStartDate(startDate);

      let endDate = getDate();
      var endDateJson = JSON.stringify(endDate);
      setSelectedEndDate(endDate);

      var owner = props.filter === "owned" ? true : false;
      var attendant = false;
      if (props.filter === "invated to") {
        attendant = true;
        setAttendantStateFilter({open: true, value: ''});
      } else {
        setAttendantStateFilter({open: false, value: ''});
      }

      tableFilter.userId = props.loggedUser.id;
      tableFilter.startDate = startDateJson.substring(1, startDateJson.length-1);
      tableFilter.endDate = endDateJson.substring(1, endDateJson.length-1);
      tableFilter.meetingStatusId = undefined;
      tableFilter.attandantStatusId = undefined;
      tableFilter.meetingScheduleId = undefined;
      tableFilter.attendant = attendant;
      tableFilter.owner = owner;

      props.listenGetFilteredMeetings(tableFilter);
      },[props.filter]);
      
      const [showFilterDlg, setShowFilterDlg] = useState(false);
      const [showItemDetail, setShowItemDetail] = useState({open: false});

      const openItemDetail = (event, meeting) => {
        let local = Object.assign({}, meeting);
        setShowItemDetail({open: true, detail: local});
      };

      const getDate = () => {        
      var tempDate = new Date();
      tempDate.setDate(tempDate.getDate() + 14);
      tempDate.setHours(23,59,59,59);
      return tempDate;
      }

      const getDateZero = () => {
        var tempDate = new Date();
        tempDate.setHours(0,0,0,0);
        return tempDate;
      }

      const [selectedStartDate, setSelectedStartDate] = useState(getDateZero());
      const [selectedEndDate, setSelectedEndDate] = useState(new Date(getDate()));

      const handleStartDateChange = date => {
        setSelectedStartDate(date);
      };

      const handleEndDateChange = date => {
        setSelectedEndDate(date);
      };

      const closeItemDetail = () => {
        setShowItemDetail({open: false});
      }

      const editDate = (date) => {
        var dateStr = date.substring(0, date.length - 5);                 
        return(new Date(dateStr)) ;
      }

        const [meetingStateFilter, setMeetingStateFilter] = useState();
        const [attendantStateFilter, setAttendantStateFilter] = useState({open: false, value: ''});
        const [meetingScheduleFilter,setMeetingScheduleFilter] = useState();


        const handleMeetingScheduleChange = event => {
          setMeetingScheduleFilter(event.target.value);
        };

        const handleMeetingStateChange = event => {
          setMeetingStateFilter(event.target.value);
        };

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
            statuses.push({
              value: props.meetingState[i].id,
              label: props.meetingState[i].status
            })
          }
          return statuses;
        }

      const findUser = (index) => {
        if (props.users != undefined) {
          if (index === props.loggedUser.id) {
            return "You"
          } else {
            let local = props.users.find( ({ id }) => id === index ); 
            if ( local ) {
              return local.name; 
            }
          }
        }
      }

    const findAttendantStateId = (index) => {
      if (props.attendantStatus) {
        let local = props.attendantStatus.find( ({ id }) => id === index );
        if (local) {
          return local;
        }
        return '';
      }
    }

      const showInvitedMenu = (event,attendants) => {
        console.log(attendants);
      }

      const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleCloseInvitations = () => {
        setAnchorEl(null);
      };

      const options = [
        'None',
        'Atria',
      ];

       //nezobrazujem pozvanky ak je vlastnikom meetingu
       const removeInvitations = (meeting) => {
        if (meeting.userId === props.loggedUser.id) {
          let listInvited = [] 
          meeting.attendants.map(( att ) => {
            let name = findUser(att.userId);
            let state = findAttendantStateId(att.attendantStatusId)
            listInvited = [...listInvited, {name: name, state: state.id}];
          } );
          return (
          <TableRowMenu meeting={meeting.id} invited={listInvited}/>
          )
        } else {
          for (var i = 0; i < meeting.attendants.length; i++) {
            if(meeting.attendants[i].userId === props.loggedUser.id) {
              return findAttendantStateId(meeting.attendants[i].attendantStatusId).status;
            }
          }
        }
      };


      const findMeeingScheduleId = (index) => {
        if (props.meetingSchedule != undefined) {
          let local = props.meetingSchedule.find( ({ id }) => id === index )
          if (local) {
            return local.recurrenceType;
          }
          return '';
        }
      }

      const findMeetingStateId = (index) => {
        if ( props.meetingState != undefined) {
          let local = props.meetingState.find( ({ id }) => id === index );
          if (local) {
            return local.status;
          }
        } 
        return '';
      }

    if ( props.success === "update"  && !props.loading ) {
      handleCloseApply();
      listenClear();
    }

    let columns = [
    {
      Header: "Owner",
      accessor: "userId",
      width: 120, maxWidth: 120, minWidth: 60,
      textAlign: "auto",
      Cell: props => {
        return (<div>{findUser(props.original.userId)}</div>)}
  },
    {
        Header: "Place",
        accessor: "place",
        style: {
          textAlign: "center"
        },
    },
    {
        Header: "Date",
        accessor: "date",
        style: {
          textAlign: "center"
        },
        Cell: props => {
        return (<Moment format="DD.MM.YYYY">{editDate(props.value)}</Moment>)}
    },
    {
      Header: "Time",
      accessor: "date",
      style: {
        textAlign: "center"
      },
      width: 50, maxWidth: 50, minWidth: 50,
      Cell: props => {
      return (<Moment format="HH:mm">{editDate(props.value)}</Moment>)}
      },
    {
        Header: "Short title",
        accessor: "shortTitle",
        style: {
          textAlign: "center"
        },
        width: 250, maxWidth: 250, minWidth: 200,
    },
    {
      Header: "Repeat",
      accessor: "meetingScheduleId",
      style: {
        textAlign: "center"
      },
      Cell: props => {
        return (<div>{findMeeingScheduleId(props.original.meetingScheduleId)}</div>)}
    },
    {
      Header: "Invitation",
      accessor: "meetingStatusId",
      style: {
        textAlign: "center"
      },
      Cell: props => {
        return (<div>{removeInvitations(props.original)}</div>)}
  },
    {
      style: {
        textAlign: "center"
      },
      Header: "Status",
      accessor: "meetingStatusId",
      Cell: props => {
        return (<div>{findMeetingStateId(props.original.meetingStatusId)}</div>)}
  },
    {
        Header: "",
        filterable: false,
        Cell: props => {
          return (
          <IconButton onClick={event => openItemDetail(event, props.original)}>
            <MoreVertIcon />
          </IconButton>
          )
        },
        width: 60, maxWidth: 60, minWidth: 60,
        className: "menu-cell",
    }];

    const handleClickOpen = () => {
      setShowFilterDlg(true);
    };
  
    const handleClose = () => {
      setShowFilterDlg(false);
     };

    const handleCloseReset = () => {
      setMeetingStateFilter();
      setAttendantStateFilter({...attendantStateFilter,value: undefined});
      setMeetingScheduleFilter();
      let deteZero = new Date();
      deteZero.setHours(0,0,0,0);
      setSelectedStartDate(deteZero);
      setSelectedEndDate(new Date(getDate())); 
    };

    const handleCloseApply= () => {
      setShowFilterDlg(false);
      tableFilter.endDate = selectedEndDate.toJSON();
      tableFilter.startDate = selectedStartDate.toJSON();

      if (meetingStateFilter  !== "") {
        tableFilter.meetingStatusId = meetingStateFilter;
      }
      if (attendantStateFilter.value  !== "") {
        tableFilter.attandantStatusId = attendantStateFilter.value;
      }
      if (meetingScheduleFilter  !== "") {
        tableFilter.meetingScheduleId = meetingScheduleFilter;
      }

      props.listenGetFilteredMeetings(tableFilter);
      listenClear();
    };

    const handleChangeDataShowItemDetail = (data) => {
      setShowItemDetail({
        ...showItemDetail,
        detail: data
      })
    }

    const handleShowItemDetail = () => {
      if (showItemDetail.open) {
        return ( 
        <div>
          <Detail 
            detail={showItemDetail.detail} 
            closeDetail={closeItemDetail} 
            changeData={handleChangeDataShowItemDetail}
            refreshTable={handleCloseApply}  />
        </div>
        );
      } else {
        return (
          <div>
                <Toolbar>
                  <Typography variant="h5" noWrap>
                        {props.title}
                  </Typography>
                  <Typography variant="h5" noWrap color='textSecondary' className={classes.filterDate} >
                   <Moment format={"DD.MM.YY"}>{selectedStartDate ? selectedStartDate : getDateZero()}</Moment> - <Moment format={"DD.MM.YY"}>{selectedEndDate ? selectedEndDate :  new Date(getDate())}</Moment>
                  </Typography>
                  <Tooltip title="Filter">
                  <IconButton onClick={handleClickOpen}
                      className={classes.toolbarButtons} 
                      aria-label="filter table"
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                </Toolbar>
                {props.loading ? <div className={classes.submit} style={{ marginLeft: 200 }}><CircularProgress 
            className={classes.proccess}
             /></div> :
                  <ReactTable
                  columns={columns}
                  data={props.meetings || ''}
                  defaultPageSize={10}
                  noDataText={"No data"}
                  getTrProps={(state, rowInfo) => {
                    if (rowInfo) {
                      return {
                        style: {
                          background: (rowInfo.row.meetingStatusId === 40) ? '#69E87E' 
                            : (rowInfo.row.meetingStatusId === 41) ? '#E86969' : 
                            (rowInfo.row.meetingStatusId === 42) ? '#E8A969' : '#c2c2c2'
                        }
                      }  
                    } else {
                      return {};
                    }
                  }}
                /> }
          </div>
        );
      }
    }

    const handleAttendantStateChange = event => {
      setAttendantStateFilter({...attendantStateFilter,value: event.target.value});
    };

    const getAttendantStatuses = () => {
      var statuses = [];
      for(var i = 0 ; i < props.attendantStatus.length ; i++) {
        statuses.push({
          value: props.attendantStatus[i].id,
          label: props.attendantStatus[i].status
        })
      }
      return statuses;
    }

    const handleShowFilterAttendant = () => {
      if (attendantStateFilter.open) {
        return (<TextField
          id="standard-attendant-currency"
          select
          label="attendant status"
          value={attendantStateFilter.value}
          onChange={handleAttendantStateChange}
          helperText="Please select attendant status"
        >
          {getAttendantStatuses().map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>);
      } else {
        return;
      }
    }

    return (
    <div>
    <Paper className={classes.paper}>
      {handleShowItemDetail()}
    </Paper>
            
      <Dialog open={showFilterDlg} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Filter</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Select the criteria by which you want to filter meetings.
          </DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
            <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="startDate"
                  label="Start date"
                  value={selectedStartDate}
                  onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="endDate"
                  label="End date"
                  minDate={selectedStartDate}
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
            </Grid>
          </MuiPickersUtilsProvider>
            <div>
              <TextField
              id="select-meeting-Status"
              select
              label="meeting status"
              value={meetingStateFilter}
              onChange={handleMeetingStateChange}
              helperText="Please select meeting status"
            >
              {getMeetingStatuses().map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
         <TextField
          id="standard-meeting-schedule"
          select
          label="recurence"
          value={meetingScheduleFilter}
          onChange={handleMeetingScheduleChange}
          helperText="Please select meeting schedule"
        >
          {getMeetingSchedule().map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
         </div>
         <div>
           {handleShowFilterAttendant()}
           </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseReset} color="primary">
            Reset
          </Button>
          <Button onClick={handleCloseApply} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
        </div>
    )
}
const mapStateToProps = state => ({
    meetings: state.meetingState.meeting,
    loggedUser: state.userState.user,
    failMessage: state.userState.failMessage,
    attendantStatus: state.refData.attendantStatus,
    meetingSchedule: state.refData.meetingSchedule,
    meetingState: state.refData.meetingState,
    users: state.refData.users,
    loading: state.meetingState.loading
});
const mapDispatchToProps = {
    listenGetFilteredMeetings,
    getLoggedUser,
    listenClear
}
export default connect(
mapStateToProps,
mapDispatchToProps
)(Table);