import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import ListIcon from '@material-ui/icons/List';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import Tooltip from '@material-ui/core/Tooltip';

export default function TableRowMenu({...props}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const giveIcon = (state) => {
    switch (state) {
      case 30: 
        return <Tooltip title="invited"><IconButton style={{padding: "0"}}><RemoveIcon style={{fill: "blue"}} /></IconButton></Tooltip>
      case 31:
        return <Tooltip title="accept"><IconButton style={{padding: "0"}}><CheckIcon style={{fill: "green"}}/></IconButton></Tooltip>
      case 32:
        return <Tooltip title="refuse"><IconButton style={{padding: "0"}}><CloseIcon style={{fill: "red"}}/></IconButton></Tooltip>
      default:
        return ''  
    }
  }

  return (
    <div>

      <IconButton
        aria-label="More"
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <ListIcon ></ListIcon>
      </IconButton>

      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
          {props.invited.map((option,i) => (
          <MenuItem key= {`attendant-${props.meeting}-${i}`} >
            {option.name} {giveIcon(option.state)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
