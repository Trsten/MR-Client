import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles(theme => ({
  root:{}
}));

export default function FontAwesome() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Icon className="fa fa-plus-circle" color="primary" />
    </div>
  );
}