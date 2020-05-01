import React, { useState, useEffect } from 'react';
import { doLogout } from './redux/saga/loginActions';
import { connect } from 'react-redux';
import CreateForm from './components/CreateForm';

import { Link, Redirect} from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HomeIcon from '@material-ui/icons/Home';
import SendIcon from '@material-ui/icons/Send';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import EventSeatIcon from '@material-ui/icons/EventSeat';

import { listenMeetingStatus, listenAttendantStatus, listenMeetingSchedule, listenGetUsers } from './redux/saga/refDataActions';

import Table from './components/Table';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
}));

function Home({ isLogged, doLogout,listenClear, listenAttendantStatus,listenMeetingSchedule,listenMeetingStatus,listenGetUsers, loading, success }) {

  useEffect(() => { 
    listenAttendantStatus();
    listenMeetingStatus();
    listenMeetingSchedule();
    listenGetUsers();
    },[]);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openAlter, setOpenAlter] = useState({open: false, severity: '', msg: ''});
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlter({...openAlter,open: false});
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handlePlot = () => {
    switch(selectedIndex) {
       case 0: 
          return <Table filter="all" title="All meetings"/>;  
      case 1: 
          return <CreateForm/>;
      case 2:
          return <Table filter="invated to" title="Meetings where you are invited"/>; 
      case 3:
          return <Table filter="owned" title="Meetings where you are leader"/>; 
      case 4:
          //TODO: vycistit meetingy
          doLogout();
          return <Redirect to="/"/>;
      default:
          return;
        } 
    }

  // if(!isLogged) {
  //   return <Redirect to="/"/>;
  // }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
             Meeting report 
          </Typography>
          <IconButton 
          color="inherit"
          className={classes.toolbarButtons}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>

      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />

        <List component="nav" aria-label="main mailbox folders">
        <ListItem
          button
          selected={selectedIndex === 0}
          onClick={event => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ListItemText primary="New meeting" />
        </ListItem>

        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Invited to" />
        </ListItem>

        <ListItem
          button
          selected={selectedIndex === 3}
          onClick={event => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <EventSeatIcon />
          </ListItemIcon>
          <ListItemText primary="Owned" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 4}
          onClick={event => handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>           
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div>
          {handlePlot()}
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = state => ({
  meeting: state.meetingState.meeting,
  isLogged: state.userState.isLogged,
  attendantStatus: state.refData.attendantStatus,
  meetingSchedule: state.refData.meetingSchedule,
  meetingStatus: state.refData.meetingStatus,
  users: state.refData.users,
  failMessage: state.userState.failMessage,
});
const mapDispatchToProps = {
  doLogout,
  listenMeetingSchedule,
  listenAttendantStatus,
  listenMeetingStatus,
  listenGetUsers,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);